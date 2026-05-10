const express = require('express');
const router = express.Router();
const { runQuery, runQuerySingle } = require('../db/database');
const { optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.use(optionalAuth);

// ─── GET /api/skills ────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const conditions = [];
  const params = {};

  if (category) { conditions.push('s.category = $category'); params.category = category; }
  if (search) { conditions.push('s.name CONTAINS $search'); params.search = search; }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const skills = await runQuery(`
    MATCH (s:Skill) ${whereClause}
    RETURN s.id AS id, s.name AS name, s.category AS category, toString(s.created_at) AS created_at
    ORDER BY s.category, s.name
  `, params);

  res.json({ success: true, data: skills });
}));

// ─── GET /api/skills/categories ─────────────────────────────
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await runQuery(`
    MATCH (s:Skill)
    RETURN s.category AS category, count(s) AS skill_count
    ORDER BY skill_count DESC
  `);
  res.json({ success: true, data: categories });
}));

// ─── GET /api/skills/trending ───────────────────────────────
router.get('/trending', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const trending = await runQuery(`
    MATCH (j:JobPosting {status: 'active'})-[:REQUIRES]->(s:Skill)
    RETURN s.id AS id, s.name AS name, s.category AS category, count(j) AS demand_count
    ORDER BY demand_count DESC LIMIT ${limit}
  `);

  res.json({ success: true, data: trending });
}));

module.exports = router;
