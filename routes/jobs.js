const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body, query } = require('express-validator');
const { runQuery, runQuerySingle } = require('../db/database');
const { authenticate, requireRole, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');
const { findMatchingCandidates } = require('../utils/matchingEngine');

// ─── POST /api/jobs (employer only) ─────────────────────────
router.post('/', authenticate, requireRole('employer'), [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('salary_min').optional().isInt({ min: 0 }),
  body('salary_max').optional().isInt({ min: 0 }),
  body('job_type').optional().isIn(['full-time', 'part-time', 'internship', 'contract']),
  body('required_skills').optional().isArray(),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { title, description, location, salary_min, salary_max, job_type, required_skills } = req.body;
  const id = uuidv4();

  await runQuery(`
    MATCH (u:User {id: $employerId})
    CREATE (u)-[:POSTED]->(j:JobPosting {
      id: $id, title: $title, description: $desc, location: $loc,
      salary_min: $salMin, salary_max: $salMax, job_type: $jobType,
      status: 'active', created_at: toString(datetime()), updated_at: toString(datetime())
    })
  `, {
    employerId: req.user.id, id, title, desc: description || '', loc: location || '',
    salMin: salary_min || 0, salMax: salary_max || 0, jobType: job_type || 'full-time',
  });

  if (required_skills && required_skills.length > 0) {
    for (const rs of required_skills) {
      await runQuery(`
        MATCH (j:JobPosting {id: $jobId}), (s:Skill {id: $skillId})
        MERGE (j)-[r:REQUIRES]->(s)
        SET r.min_proficiency = $minProf
      `, { jobId: id, skillId: rs.skill_id, minProf: rs.min_proficiency || 1 });
    }
  }

  const job = await runQuerySingle('MATCH (j:JobPosting {id: $id}) RETURN j { .* } AS job', { id });
  const skills = await runQuery(`
    MATCH (j:JobPosting {id: $id})-[r:REQUIRES]->(s:Skill)
    RETURN s.id AS skill_id, s.name AS skill_name, r.min_proficiency AS min_proficiency
  `, { id });

  res.status(201).json({ success: true, data: { ...job.job, required_skills: skills } });
}));

// ─── GET /api/jobs (public) ─────────────────────────────────
router.get('/', optionalAuth, [
  query('search').optional().trim(),
  query('job_type').optional().isIn(['full-time', 'part-time', 'internship', 'contract']),
  query('location').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { search, job_type, location, limit, offset } = req.query;
  const maxResults = parseInt(limit) || 20;
  const skip = parseInt(offset) || 0;

  const conditions = ["j.status = 'active'"];
  const params = { };

  if (search) { conditions.push('(j.title CONTAINS $search OR j.description CONTAINS $search)'); params.search = search; }
  if (job_type) { conditions.push('j.job_type = $jobType'); params.jobType = job_type; }
  if (location) { conditions.push('j.location CONTAINS $location'); params.location = location; }

  const whereClause = 'WHERE ' + conditions.join(' AND ');

  const jobs = await runQuery(`
    MATCH (e:User)-[:POSTED]->(j:JobPosting)
    ${whereClause}
    RETURN j.id AS id, j.title AS title, j.description AS description, j.location AS location,
           j.salary_min AS salary_min, j.salary_max AS salary_max, j.job_type AS job_type,
           j.status AS status, j.created_at AS created_at,
           e.company_name AS company_name, e.logo_url AS logo_url
    ORDER BY j.created_at DESC SKIP ${skip} LIMIT ${maxResults}
  `, params);

  // Attach skills
  const enriched = [];
  for (const j of jobs) {
    const skills = await runQuery(`
      MATCH (jp:JobPosting {id: $id})-[r:REQUIRES]->(s:Skill)
      RETURN s.id AS skill_id, s.name AS skill_name, r.min_proficiency AS min_proficiency
    `, { id: j.id });
    enriched.push({ ...j, required_skills: skills });
  }

  const countResult = await runQuerySingle(`
    MATCH (e:User)-[:POSTED]->(j:JobPosting) ${whereClause}
    RETURN count(j) AS count
  `, params);

  res.json({ success: true, data: enriched, total: countResult ? countResult.count : 0, limit: maxResults, offset: skip });
}));

// ─── GET /api/jobs/:id ──────────────────────────────────────
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const job = await runQuerySingle(`
    MATCH (e:User)-[:POSTED]->(j:JobPosting {id: $id})
    RETURN j { .* } AS job, e.company_name AS company_name, e.logo_url AS logo_url,
           e.industry AS industry, e.website AS website
  `, { id: req.params.id });

  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

  const skills = await runQuery(`
    MATCH (j:JobPosting {id: $id})-[r:REQUIRES]->(s:Skill)
    RETURN s.id AS skill_id, s.name AS skill_name, s.category AS category, r.min_proficiency AS min_proficiency
  `, { id: req.params.id });

  res.json({ success: true, data: { ...job.job, company_name: job.company_name, logo_url: job.logo_url, industry: job.industry, website: job.website, required_skills: skills } });
}));

// ─── PUT /api/jobs/:id ──────────────────────────────────────
router.put('/:id', authenticate, requireRole('employer'), asyncHandler(async (req, res) => {
  const job = await runQuerySingle(`
    MATCH (u:User {id: $userId})-[:POSTED]->(j:JobPosting {id: $jobId})
    RETURN j.id AS id
  `, { userId: req.user.id, jobId: req.params.id });
  if (!job) return res.status(404).json({ success: false, error: 'Job not found or access denied' });

  const fields = ['title', 'description', 'location', 'salary_min', 'salary_max', 'job_type', 'status'];
  const setClauses = ['j.updated_at = toString(datetime())'];
  const params = { jobId: req.params.id };

  for (const f of fields) {
    if (req.body[f] !== undefined) { setClauses.push(`j.${f} = $${f}`); params[f] = req.body[f]; }
  }

  const updated = await runQuerySingle(`
    MATCH (j:JobPosting {id: $jobId}) SET ${setClauses.join(', ')}
    RETURN j { .* } AS job
  `, params);

  res.json({ success: true, data: updated.job });
}));

// ─── DELETE /api/jobs/:id ───────────────────────────────────
router.delete('/:id', authenticate, requireRole('employer'), asyncHandler(async (req, res) => {
  const job = await runQuerySingle(`
    MATCH (u:User {id: $userId})-[:POSTED]->(j:JobPosting {id: $jobId}) RETURN j.id AS id
  `, { userId: req.user.id, jobId: req.params.id });
  if (!job) return res.status(404).json({ success: false, error: 'Job not found or access denied' });

  await runQuery(`
    MATCH (j:JobPosting {id: $jobId}) SET j.status = 'closed', j.updated_at = toString(datetime())
  `, { jobId: req.params.id });

  res.json({ success: true, message: 'Job posting closed' });
}));

// ─── GET /api/jobs/:id/matches ──────────────────────────────
router.get('/:id/matches', authenticate, requireRole('employer'), asyncHandler(async (req, res) => {
  const job = await runQuerySingle(`
    MATCH (u:User {id: $userId})-[:POSTED]->(j:JobPosting {id: $jobId}) RETURN j.id AS id
  `, { userId: req.user.id, jobId: req.params.id });
  if (!job) return res.status(404).json({ success: false, error: 'Job not found or access denied' });

  const limit = parseInt(req.query.limit) || 20;
  const candidates = await findMatchingCandidates(req.params.id, limit);
  res.json({ success: true, data: candidates });
}));

// ─── GET /api/jobs/:id/applications ─────────────────────────
router.get('/:id/applications', authenticate, requireRole('employer'), asyncHandler(async (req, res) => {
  const job = await runQuerySingle(`
    MATCH (u:User {id: $userId})-[:POSTED]->(j:JobPosting {id: $jobId}) RETURN j.id AS id
  `, { userId: req.user.id, jobId: req.params.id });
  if (!job) return res.status(404).json({ success: false, error: 'Job not found or access denied' });

  const apps = await runQuery(`
    MATCH (s:User)-[:APPLIED]->(a:Application)-[:FOR_JOB]->(j:JobPosting {id: $jobId})
    RETURN a.id AS id, a.status AS status, a.match_score AS match_score, a.applied_at AS applied_at,
           s.full_name AS student_name, s.email AS student_email, s.trust_score AS trust_score,
           s.headline AS headline
    ORDER BY a.match_score DESC
  `, { jobId: req.params.id });

  res.json({ success: true, data: apps });
}));

// ─── PUT /api/jobs/:id/applications/:appId ──────────────────
router.put('/:id/applications/:appId', authenticate, requireRole('employer'), [
  body('status').isIn(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted']).withMessage('Invalid status'),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const job = await runQuerySingle(`
    MATCH (u:User {id: $userId})-[:POSTED]->(j:JobPosting {id: $jobId}) RETURN j.id AS id
  `, { userId: req.user.id, jobId: req.params.id });
  if (!job) return res.status(404).json({ success: false, error: 'Job not found or access denied' });

  const app = await runQuerySingle(`
    MATCH (a:Application {id: $appId})-[:FOR_JOB]->(j:JobPosting {id: $jobId}) RETURN a.id AS id
  `, { appId: req.params.appId, jobId: req.params.id });
  if (!app) return res.status(404).json({ success: false, error: 'Application not found' });

  const updated = await runQuerySingle(`
    MATCH (a:Application {id: $appId})
    SET a.status = $status, a.updated_at = toString(datetime())
    RETURN a.id AS id, a.status AS status, a.match_score AS match_score, a.applied_at AS applied_at
  `, { appId: req.params.appId, status: req.body.status });

  res.json({ success: true, data: updated });
}));

module.exports = router;
