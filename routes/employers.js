const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { runQuery, runQuerySingle } = require('../db/database');
const { authenticate, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');

router.use(authenticate, requireRole('employer'));

// ─── GET /api/employers/profile ─────────────────────────────
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await runQuerySingle(`
    MATCH (u:User {id: $id})
    RETURN u.id AS id, u.email AS email, u.full_name AS full_name, u.created_at AS created_at,
           u.company_name AS company_name, u.industry AS industry, u.company_size AS company_size,
           u.website AS website, u.description AS description, u.logo_url AS logo_url
  `, { id: req.user.id });

  const profile = {
    company_name: user.company_name, industry: user.industry, company_size: user.company_size,
    website: user.website, description: user.description, logo_url: user.logo_url,
  };

  res.json({ success: true, data: { id: user.id, email: user.email, full_name: user.full_name, created_at: user.created_at, profile } });
}));

// ─── PUT /api/employers/profile ─────────────────────────────
router.put('/profile', [
  body('company_name').optional().trim().notEmpty(),
  body('industry').optional().trim(),
  body('company_size').optional().trim(),
  body('website').optional().trim(),
  body('description').optional().trim(),
  body('logo_url').optional().trim(),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const fields = ['company_name', 'industry', 'company_size', 'website', 'description', 'logo_url'];
  const setClauses = [];
  const params = { id: req.user.id };

  for (const f of fields) {
    if (req.body[f] !== undefined) { setClauses.push(`u.${f} = $${f}`); params[f] = req.body[f]; }
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ success: false, error: 'No fields to update' });
  }

  const result = await runQuerySingle(`
    MATCH (u:User {id: $id}) SET ${setClauses.join(', ')}
    RETURN u.company_name AS company_name, u.industry AS industry, u.company_size AS company_size,
           u.website AS website, u.description AS description, u.logo_url AS logo_url
  `, params);

  res.json({ success: true, data: result });
}));

// ─── GET /api/employers/dashboard ───────────────────────────
router.get('/dashboard', asyncHandler(async (req, res) => {
  const stats = await runQuerySingle(`
    MATCH (u:User {id: $id})
    OPTIONAL MATCH (u)-[:POSTED]->(j:JobPosting)
    WITH u, count(DISTINCT j) AS jobCount
    OPTIONAL MATCH (u)-[:POSTED]->(ja:JobPosting {status: 'active'})
    WITH u, jobCount, count(DISTINCT ja) AS activeJobs
    OPTIONAL MATCH (u)-[:POSTED]->(jp:JobPosting)<-[:FOR_JOB]-(a:Application)
    WITH u, jobCount, activeJobs, count(DISTINCT a) AS totalApps
    OPTIONAL MATCH (u)-[:MADE_HIRE]->(h:HireRecord)
    RETURN jobCount AS total_jobs, activeJobs AS active_jobs,
           totalApps AS total_applications, count(DISTINCT h) AS total_hires
  `, { id: req.user.id });

  const recentApps = await runQuery(`
    MATCH (e:User {id: $id})-[:POSTED]->(j:JobPosting)<-[:FOR_JOB]-(a:Application)<-[:APPLIED]-(s:User)
    RETURN a.id AS id, a.status AS status, a.match_score AS match_score, a.applied_at AS applied_at,
           s.full_name AS student_name, s.email AS student_email, s.trust_score AS trust_score,
           j.title AS job_title
    ORDER BY a.applied_at DESC LIMIT 10
  `, { id: req.user.id });

  res.json({
    success: true,
    data: {
      total_jobs: stats ? stats.total_jobs : 0,
      active_jobs: stats ? stats.active_jobs : 0,
      total_applications: stats ? stats.total_applications : 0,
      total_hires: stats ? stats.total_hires : 0,
      recent_applications: recentApps,
    },
  });
}));

// ─── GET /api/employers/candidates ──────────────────────────
router.get('/candidates', [
  query('skill').optional().trim(),
  query('min_trust_score').optional().isFloat({ min: 0, max: 100 }),
  query('university').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { skill, min_trust_score, university, limit } = req.query;
  const maxResults = parseInt(limit) || 20;

  let matchClause = "MATCH (u:User {role: 'student'})";
  const conditions = [];
  const params = { };

  if (skill) {
    matchClause += "-[:HAS_SKILL]->(sk:Skill)";
    conditions.push('sk.name CONTAINS $skill');
    params.skill = skill;
  }
  if (min_trust_score !== undefined && min_trust_score !== '') {
    conditions.push('u.trust_score >= $minTrust');
    params.minTrust = parseFloat(min_trust_score);
  }
  if (university) {
    conditions.push('u.university CONTAINS $university');
    params.university = university;
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const candidates = await runQuery(`
    ${matchClause}
    ${whereClause}
    RETURN DISTINCT u.id AS id, u.full_name AS full_name, u.email AS email,
           u.headline AS headline, u.university AS university, u.trust_score AS trust_score,
           u.github_url AS github_url, u.linkedin_url AS linkedin_url
    ORDER BY u.trust_score DESC LIMIT ${maxResults}
  `, params);

  // Attach skills to each candidate
  const enriched = [];
  for (const c of candidates) {
    const skills = await runQuery(`
      MATCH (u:User {id: $id})-[r:HAS_SKILL]->(s:Skill)
      RETURN s.name AS name, r.proficiency AS proficiency, r.verified AS verified
    `, { id: c.id });
    enriched.push({ ...c, skills });
  }

  res.json({ success: true, data: enriched, total: enriched.length });
}));

module.exports = router;
