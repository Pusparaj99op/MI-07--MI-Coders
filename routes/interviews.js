const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const { runQuery, runQuerySingle } = require('../db/database');
const { authenticate, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');
const { recordTrustEvent } = require('../utils/trustScoreEngine');

router.use(authenticate, requireRole('student'));

// ─── POST /api/interviews ───────────────────────────────────
router.post('/', [
  body('topic').trim().notEmpty().withMessage('Interview topic is required'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be 0-100'),
  body('feedback').optional().trim(),
  body('duration_minutes').optional().isInt({ min: 1 }),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { topic, difficulty, score, feedback, duration_minutes } = req.body;
  const diff = difficulty || 'medium';
  const id = uuidv4();

  await runQuery(`
    MATCH (u:User {id: $userId})
    CREATE (u)-[:DID_INTERVIEW]->(i:MockInterview {
      id: $id, topic: $topic, difficulty: $diff, score: $score,
      feedback: $feedback, duration_minutes: $duration,
      completed_at: toString(datetime())
    })
  `, { userId: req.user.id, id, topic, diff, score: parseFloat(score), feedback: feedback || '', duration: duration_minutes || 0 });

  const eventType = `mock_interview_${diff}`;
  const trustResult = await recordTrustEvent(req.user.id, eventType, { topic, score, difficulty: diff });

  res.status(201).json({ success: true, data: { id, topic, difficulty: diff, score: parseFloat(score), trustEvent: trustResult } });
}));

// ─── GET /api/interviews ────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const interviews = await runQuery(`
    MATCH (u:User {id: $id})-[:DID_INTERVIEW]->(i:MockInterview)
    RETURN i.id AS id, i.topic AS topic, i.difficulty AS difficulty, i.score AS score,
           i.feedback AS feedback, i.duration_minutes AS duration_minutes, i.completed_at AS completed_at
    ORDER BY i.completed_at DESC
  `, { id: req.user.id });

  res.json({ success: true, data: interviews });
}));

// ─── GET /api/interviews/stats ──────────────────────────────
router.get('/stats', asyncHandler(async (req, res) => {
  const total = await runQuerySingle(`
    MATCH (u:User {id: $id})-[:DID_INTERVIEW]->(i:MockInterview)
    RETURN count(i) AS count, avg(i.score) AS avg
  `, { id: req.user.id });

  const byDifficulty = await runQuery(`
    MATCH (u:User {id: $id})-[:DID_INTERVIEW]->(i:MockInterview)
    RETURN i.difficulty AS difficulty, count(i) AS count, avg(i.score) AS avg_score
    ORDER BY i.difficulty
  `, { id: req.user.id });

  const byTopic = await runQuery(`
    MATCH (u:User {id: $id})-[:DID_INTERVIEW]->(i:MockInterview)
    RETURN i.topic AS topic, count(i) AS count, avg(i.score) AS avg_score
    ORDER BY count DESC LIMIT 10
  `, { id: req.user.id });

  res.json({
    success: true,
    data: {
      total_interviews: total ? total.count : 0,
      average_score: total && total.avg ? Math.round(total.avg * 100) / 100 : 0,
      by_difficulty: byDifficulty,
      by_topic: byTopic,
    },
  });
}));

module.exports = router;
