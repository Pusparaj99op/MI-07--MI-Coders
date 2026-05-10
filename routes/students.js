const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const { runQuery, runQuerySingle } = require('../db/database');
const { authenticate, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');
const { recordTrustEvent } = require('../utils/trustScoreEngine');
const { calculateMatchScore } = require('../utils/matchingEngine');

router.use(authenticate, requireRole('student'));

// ─── GET /api/students/profile ──────────────────────────────
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await runQuerySingle(`
    MATCH (u:User {id: $id})
    RETURN u.id AS id, u.email AS email, u.full_name AS full_name, u.created_at AS created_at,
           u.headline AS headline, u.bio AS bio, u.university AS university,
           u.graduation_year AS graduation_year, u.resume_url AS resume_url,
           u.trust_score AS trust_score, u.trust_score_hash AS trust_score_hash,
           u.github_url AS github_url, u.linkedin_url AS linkedin_url, u.portfolio_url AS portfolio_url
  `, { id: req.user.id });

  const skills = await runQuery(`
    MATCH (u:User {id: $id})-[r:HAS_SKILL]->(s:Skill)
    RETURN s.id AS skill_id, s.name AS skill_name, s.category AS category,
           r.proficiency AS proficiency, r.verified AS verified, r.source AS source
  `, { id: req.user.id });

  const profile = {
    headline: user.headline, bio: user.bio, university: user.university,
    graduation_year: user.graduation_year, resume_url: user.resume_url,
    trust_score: user.trust_score, trust_score_hash: user.trust_score_hash,
    github_url: user.github_url, linkedin_url: user.linkedin_url, portfolio_url: user.portfolio_url,
  };

  res.json({ success: true, data: { id: user.id, email: user.email, full_name: user.full_name, created_at: user.created_at, profile, skills } });
}));

// ─── PUT /api/students/profile ──────────────────────────────
router.put('/profile', [
  body('headline').optional().trim(),
  body('bio').optional().trim(),
  body('university').optional().trim(),
  body('graduation_year').optional().isInt({ min: 2000, max: 2035 }),
  body('github_url').optional().trim(),
  body('linkedin_url').optional().trim(),
  body('portfolio_url').optional().trim(),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const fields = ['headline', 'bio', 'university', 'graduation_year', 'github_url', 'linkedin_url', 'portfolio_url'];
  const setClauses = [];
  const params = { id: req.user.id };

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      setClauses.push(`u.${field} = $${field}`);
      params[field] = req.body[field];
    }
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ success: false, error: 'No fields to update' });
  }

  const result = await runQuerySingle(`
    MATCH (u:User {id: $id})
    SET ${setClauses.join(', ')}, u.updated_at = toString(datetime())
    RETURN u.headline AS headline, u.bio AS bio, u.university AS university,
           u.graduation_year AS graduation_year, u.github_url AS github_url,
           u.linkedin_url AS linkedin_url, u.portfolio_url AS portfolio_url,
           u.trust_score AS trust_score, u.resume_url AS resume_url
  `, params);

  res.json({ success: true, data: result });
}));

// ─── POST /api/students/resume ──────────────────────────────
router.post('/resume', [
  body('resume_url').trim().notEmpty().withMessage('Resume URL is required'),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  await runQuery('MATCH (u:User {id: $id}) SET u.resume_url = $url', { id: req.user.id, url: req.body.resume_url });

  const result = await recordTrustEvent(req.user.id, 'resume_uploaded', { url: req.body.resume_url });

  res.json({ success: true, data: { resume_url: req.body.resume_url, trustEvent: result } });
}));

// ─── GET /api/students/skills ───────────────────────────────
router.get('/skills', asyncHandler(async (req, res) => {
  const skills = await runQuery(`
    MATCH (u:User {id: $id})-[r:HAS_SKILL]->(s:Skill)
    RETURN s.id AS skill_id, s.name AS skill_name, s.category AS category,
           r.proficiency AS proficiency, r.verified AS verified, r.source AS source
    ORDER BY r.proficiency DESC
  `, { id: req.user.id });

  res.json({ success: true, data: skills });
}));

// ─── POST /api/students/skills ──────────────────────────────
router.post('/skills', [
  body('skill_id').trim().notEmpty().withMessage('Skill ID is required'),
  body('proficiency').isInt({ min: 1, max: 5 }).withMessage('Proficiency must be 1-5'),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { skill_id, proficiency } = req.body;

  const skill = await runQuerySingle('MATCH (s:Skill {id: $skill_id}) RETURN s.name AS name', { skill_id });
  if (!skill) {
    return res.status(404).json({ success: false, error: 'Skill not found' });
  }

  // MERGE to upsert — preserve verified/source if already employer-verified
  await runQuery(`
    MATCH (u:User {id: $userId}), (s:Skill {id: $skillId})
    MERGE (u)-[r:HAS_SKILL]->(s)
    ON CREATE SET r.proficiency = $proficiency, r.verified = false, r.source = 'self'
    ON MATCH SET r.proficiency = $proficiency,
      r.source = CASE WHEN r.source = 'employer' THEN 'employer' ELSE 'self' END
  `, { userId: req.user.id, skillId: skill_id, proficiency: parseInt(proficiency) });

  await recordTrustEvent(req.user.id, 'skill_self_assessed', { skill: skill.name, proficiency });

  res.json({ success: true, data: { skill_id, skill_name: skill.name, proficiency: parseInt(proficiency) } });
}));

// ─── GET /api/students/dashboard ────────────────────────────
router.get('/dashboard', asyncHandler(async (req, res) => {
  const stats = await runQuerySingle(`
    MATCH (u:User {id: $id})
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(sk:Skill)
    WITH u, count(DISTINCT sk) AS skillCount
    OPTIONAL MATCH (u)-[:APPLIED]->(app:Application)
    WITH u, skillCount, count(DISTINCT app) AS appCount
    OPTIONAL MATCH (u)-[:DID_INTERVIEW]->(iv:MockInterview)
    WITH u, skillCount, appCount, count(DISTINCT iv) AS ivCount
    OPTIONAL MATCH (u)-[:COMPLETED_COURSE]->(cc:CourseCompletion)
    RETURN u.trust_score AS trust_score, skillCount AS total_skills,
           appCount AS total_applications, ivCount AS total_interviews,
           count(DISTINCT cc) AS total_courses
  `, { id: req.user.id });

  const recentApps = await runQuery(`
    MATCH (u:User {id: $id})-[:APPLIED]->(a:Application)-[:FOR_JOB]->(j:JobPosting)<-[:POSTED]-(e:User)
    RETURN a.id AS id, a.status AS status, a.match_score AS match_score,
           a.applied_at AS applied_at, j.title AS job_title, e.company_name AS company_name
    ORDER BY a.applied_at DESC LIMIT 5
  `, { id: req.user.id });

  res.json({
    success: true,
    data: {
      trust_score: stats ? (stats.trust_score || 0) : 0,
      total_skills: stats ? stats.total_skills : 0,
      total_applications: stats ? stats.total_applications : 0,
      total_interviews: stats ? stats.total_interviews : 0,
      total_courses: stats ? stats.total_courses : 0,
      recent_applications: recentApps,
    },
  });
}));

// ─── GET /api/students/applications ─────────────────────────
router.get('/applications', asyncHandler(async (req, res) => {
  const apps = await runQuery(`
    MATCH (u:User {id: $id})-[:APPLIED]->(a:Application)-[:FOR_JOB]->(j:JobPosting)<-[:POSTED]-(e:User)
    RETURN a.id AS id, a.status AS status, a.match_score AS match_score,
           a.cover_letter AS cover_letter, a.applied_at AS applied_at,
           j.id AS job_id, j.title AS job_title, j.location AS location, j.job_type AS job_type,
           e.company_name AS company_name
    ORDER BY a.applied_at DESC
  `, { id: req.user.id });

  res.json({ success: true, data: apps });
}));

// ─── POST /api/students/applications ────────────────────────
router.post('/applications', [
  body('job_id').trim().notEmpty().withMessage('Job ID is required'),
  body('cover_letter').optional().trim(),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { job_id, cover_letter } = req.body;

  const job = await runQuerySingle(`
    MATCH (j:JobPosting {id: $jobId, status: 'active'}) RETURN j.id AS id, j.title AS title
  `, { jobId: job_id });
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found or no longer active' });
  }

  const existing = await runQuerySingle(`
    MATCH (u:User {id: $userId})-[:APPLIED]->(a:Application)-[:FOR_JOB]->(j:JobPosting {id: $jobId})
    RETURN a.id AS id
  `, { userId: req.user.id, jobId: job_id });
  if (existing) {
    return res.status(409).json({ success: false, error: 'You have already applied to this job' });
  }

  const match = await calculateMatchScore(req.user.id, job_id);

  const id = uuidv4();
  await runQuery(`
    MATCH (u:User {id: $userId}), (j:JobPosting {id: $jobId})
    CREATE (u)-[:APPLIED]->(a:Application {
      id: $id, status: 'pending', match_score: $matchScore,
      cover_letter: $coverLetter, applied_at: toString(datetime())
    })-[:FOR_JOB]->(j)
  `, { userId: req.user.id, jobId: job_id, id, matchScore: match.matchScore, coverLetter: cover_letter || '' });

  await recordTrustEvent(req.user.id, 'application_submitted', { job_title: job.title });

  res.status(201).json({ success: true, data: { id, job_id, match_score: match.matchScore, status: 'pending', matchDetails: match } });
}));

module.exports = router;
