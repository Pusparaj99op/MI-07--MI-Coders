const express = require('express');
const router = express.Router();
const { runQuery, runQuerySingle } = require('../db/database');
const { authenticate, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { getTrustScoreBreakdown } = require('../utils/trustScoreEngine');
const { verifyTrustHash, generateQRData } = require('../utils/crypto');

// ─── GET /api/trust-score ───────────────────────────────────
router.get('/', authenticate, requireRole('student'), asyncHandler(async (req, res) => {
  const breakdown = await getTrustScoreBreakdown(req.user.id);
  res.json({ success: true, data: breakdown });
}));

// ─── GET /api/trust-score/qr ────────────────────────────────
router.get('/qr', authenticate, requireRole('student'), asyncHandler(async (req, res) => {
  const user = await runQuerySingle(`
    MATCH (u:User {id: $id})
    RETURN u.full_name AS full_name, u.trust_score AS trust_score, u.trust_score_hash AS trust_score_hash
  `, { id: req.user.id });

  if (!user) return res.status(404).json({ success: false, error: 'Profile not found' });

  const qrData = generateQRData(req.user.id, user.full_name, user.trust_score || 0, user.trust_score_hash || '');
  res.json({ success: true, data: { qr_payload: JSON.parse(qrData), raw: qrData } });
}));

// ─── GET /api/trust-score/history ───────────────────────────
router.get('/history', authenticate, requireRole('student'), asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  const events = await runQuery(`
    MATCH (u:User {id: $id})-[:HAS_TRUST_EVENT]->(te:TrustEvent)
    RETURN te.id AS id, te.event_type AS event_type, te.points AS points,
           te.metadata AS metadata, toString(te.created_at) AS created_at
    ORDER BY te.created_at DESC LIMIT ${limit}
  `, { id: req.user.id });

  const parsed = events.map((e) => ({ ...e, metadata: JSON.parse(e.metadata || '{}') }));
  res.json({ success: true, data: parsed });
}));

// ─── GET /api/trust-score/verify/:hash (PUBLIC) ─────────────
router.get('/verify/:hash', asyncHandler(async (req, res) => {
  const profile = await runQuerySingle(`
    MATCH (u:User {trust_score_hash: $hash})
    WHERE u.role = 'student'
    RETURN u.id AS user_id, u.trust_score AS trust_score,
           u.trust_score_hash AS trust_score_hash, u.full_name AS full_name
  `, { hash: req.params.hash });

  if (!profile) {
    return res.status(404).json({ success: false, error: 'Trust score not found or invalid hash', verified: false });
  }

  let verified = false;
  try {
    verified = verifyTrustHash(profile.user_id, profile.trust_score, req.params.hash);
  } catch (_e) {
    verified = false;
  }

  res.json({
    success: true,
    data: {
      verified,
      platform: 'Talent Intel',
      student_name: profile.full_name,
      trust_score: profile.trust_score,
      verified_at: new Date().toISOString(),
    },
  });
}));

module.exports = router;
