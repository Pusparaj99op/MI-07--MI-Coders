const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const { runQuery, runQuerySingle, runTransaction } = require('../db/database');
const { authenticate, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');
const { recordTrustEvent } = require('../utils/trustScoreEngine');

router.use(authenticate, requireRole('employer'));

// ─── POST /api/feedback/hire ────────────────────────────────
router.post('/hire', [
  body('student_id').trim().notEmpty().withMessage('Student ID is required'),
  body('job_id').trim().notEmpty().withMessage('Job ID is required'),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { student_id, job_id } = req.body;

  const student = await runQuerySingle("MATCH (u:User {id: $id, role: 'student'}) RETURN u.id AS id", { id: student_id });
  if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

  const job = await runQuerySingle(`
    MATCH (u:User {id: $userId})-[:POSTED]->(j:JobPosting {id: $jobId}) RETURN j.id AS id
  `, { userId: req.user.id, jobId: job_id });
  if (!job) return res.status(404).json({ success: false, error: 'Job not found or access denied' });

  const hireId = uuidv4();

  // Create hire record
  await runQuery(`
    MATCH (e:User {id: $employerId}), (s:User {id: $studentId}), (j:JobPosting {id: $jobId})
    CREATE (e)-[:MADE_HIRE]->(h:HireRecord {
      id: $hireId, hired_at: toString(datetime()), status: 'active'
    })-[:HIRED_STUDENT]->(s)
    CREATE (h)-[:FOR_POSITION]->(j)
  `, { employerId: req.user.id, studentId: student_id, jobId: job_id, hireId });

  // Update application status
  await runQuery(`
    MATCH (s:User {id: $studentId})-[:APPLIED]->(a:Application)-[:FOR_JOB]->(j:JobPosting {id: $jobId})
    SET a.status = 'accepted', a.updated_at = toString(datetime())
  `, { studentId: student_id, jobId: job_id });

  // Award trust points
  const trustResult = await recordTrustEvent(student_id, 'hired', { employer_id: req.user.id, job_id });

  // Verify student's skills that match job requirements (only if student has them)
  const matchingSkills = await runQuery(`
    MATCH (j:JobPosting {id: $jobId})-[:REQUIRES]->(s:Skill)<-[r:HAS_SKILL]-(u:User {id: $studentId})
    RETURN s.id AS skill_id
  `, { jobId: job_id, studentId: student_id });

  let verifiedCount = 0;
  for (const ms of matchingSkills) {
    await runQuery(`
      MATCH (u:User {id: $studentId})-[r:HAS_SKILL]->(s:Skill {id: $skillId})
      SET r.verified = true, r.verified_at = toString(datetime()), r.source = 'employer'
    `, { studentId: student_id, skillId: ms.skill_id });

    await recordTrustEvent(student_id, 'skill_verified', { skill_id: ms.skill_id, verified_by: req.user.id });
    verifiedCount++;
  }

  res.status(201).json({ success: true, data: { hire_id: hireId, student_id, job_id, skills_verified: verifiedCount, trust_update: trustResult } });
}));

// ─── POST /api/feedback/review ──────────────────────────────
router.post('/review', [
  body('hire_id').trim().notEmpty().withMessage('Hire ID is required'),
  body('review_period').isIn(['3-month', '6-month', '12-month']).withMessage('Invalid review period'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('strengths').optional().trim(),
  body('improvements').optional().trim(),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { hire_id, review_period, rating, strengths, improvements } = req.body;

  const hire = await runQuerySingle(`
    MATCH (e:User {id: $userId})-[:MADE_HIRE]->(h:HireRecord {id: $hireId})-[:HIRED_STUDENT]->(s:User)
    RETURN h.id AS id, s.id AS student_id
  `, { userId: req.user.id, hireId: hire_id });

  if (!hire) return res.status(404).json({ success: false, error: 'Hire record not found or access denied' });

  const existing = await runQuerySingle(`
    MATCH (h:HireRecord {id: $hireId})-[:HAS_REVIEW]->(pr:PerformanceReview {review_period: $period})
    RETURN pr.id AS id
  `, { hireId: hire_id, period: review_period });

  if (existing) return res.status(409).json({ success: false, error: `Review for ${review_period} already submitted` });

  const reviewId = uuidv4();
  await runQuery(`
    MATCH (h:HireRecord {id: $hireId})
    CREATE (h)-[:HAS_REVIEW]->(pr:PerformanceReview {
      id: $reviewId, review_period: $period, rating: $rating,
      strengths: $strengths, improvements: $improvements,
      reviewed_at: toString(datetime())
    })
  `, { hireId: hire_id, reviewId, period: review_period, rating: parseInt(rating), strengths: strengths || '', improvements: improvements || '' });

  let eventType = 'review_neutral';
  if (rating >= 4) eventType = 'review_positive';
  else if (rating <= 2) eventType = 'review_negative';

  const trustResult = await recordTrustEvent(hire.student_id, eventType, { rating, review_period, employer_id: req.user.id });

  res.status(201).json({ success: true, data: { review_id: reviewId, hire_id, rating: parseInt(rating), review_period, trust_update: trustResult } });
}));

// ─── GET /api/feedback/analytics ────────────────────────────
router.get('/analytics', asyncHandler(async (req, res) => {
  const stats = await runQuerySingle(`
    MATCH (e:User {id: $id})
    OPTIONAL MATCH (e)-[:MADE_HIRE]->(h:HireRecord)
    WITH e, count(DISTINCT h) AS totalHires
    OPTIONAL MATCH (e)-[:MADE_HIRE]->(h2:HireRecord)-[:HAS_REVIEW]->(pr:PerformanceReview)
    RETURN totalHires AS total_hires, count(DISTINCT pr) AS total_reviews,
           avg(pr.rating) AS avg_rating
  `, { id: req.user.id });

  const ratingDist = await runQuery(`
    MATCH (e:User {id: $id})-[:MADE_HIRE]->(h:HireRecord)-[:HAS_REVIEW]->(pr:PerformanceReview)
    RETURN pr.rating AS rating, count(pr) AS count
    ORDER BY pr.rating
  `, { id: req.user.id });

  const recentHires = await runQuery(`
    MATCH (e:User {id: $id})-[:MADE_HIRE]->(h:HireRecord)-[:HIRED_STUDENT]->(s:User)
    MATCH (h)-[:FOR_POSITION]->(j:JobPosting)
    RETURN h.id AS id, h.hired_at AS hired_at, h.status AS status,
           s.full_name AS student_name, j.title AS job_title
    ORDER BY h.hired_at DESC LIMIT 10
  `, { id: req.user.id });

  res.json({
    success: true,
    data: {
      total_hires: stats ? stats.total_hires : 0,
      total_reviews: stats ? stats.total_reviews : 0,
      average_rating: stats && stats.avg_rating ? Math.round(stats.avg_rating * 100) / 100 : 0,
      rating_distribution: ratingDist,
      recent_hires: recentHires,
    },
  });
}));

module.exports = router;
