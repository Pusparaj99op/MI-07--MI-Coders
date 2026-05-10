const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const { runQuery } = require('../db/database');
const { authenticate, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');
const { recordTrustEvent } = require('../utils/trustScoreEngine');

router.use(authenticate, requireRole('student'));

// ─── POST /api/courses ──────────────────────────────────────
router.post('/', [
  body('course_name').trim().notEmpty().withMessage('Course name is required'),
  body('provider').optional().trim(),
  body('certificate_url').optional().trim(),
  body('skills_gained').optional().isArray(),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { course_name, provider, certificate_url, skills_gained } = req.body;
  const id = uuidv4();

  await runQuery(`
    MATCH (u:User {id: $userId})
    CREATE (u)-[:COMPLETED_COURSE]->(c:CourseCompletion {
      id: $id, course_name: $courseName, provider: $provider,
      certificate_url: $certUrl, skills_gained: $skillsGained,
      completion_date: toString(datetime())
    })
  `, {
    userId: req.user.id, id, courseName: course_name, provider: provider || '',
    certUrl: certificate_url || '', skillsGained: JSON.stringify(skills_gained || []),
  });

  const trustResult = await recordTrustEvent(req.user.id, 'course_completed', { course_name, provider });

  res.status(201).json({ success: true, data: { id, course_name, provider, trustEvent: trustResult } });
}));

// ─── GET /api/courses ───────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const courses = await runQuery(`
    MATCH (u:User {id: $id})-[:COMPLETED_COURSE]->(c:CourseCompletion)
    RETURN c.id AS id, c.course_name AS course_name, c.provider AS provider,
           c.certificate_url AS certificate_url, c.skills_gained AS skills_gained,
           c.completion_date AS completion_date
    ORDER BY c.completion_date DESC
  `, { id: req.user.id });

  const parsed = courses.map((c) => ({
    ...c,
    skills_gained: JSON.parse(c.skills_gained || '[]'),
  }));

  res.json({ success: true, data: parsed });
}));

module.exports = router;
