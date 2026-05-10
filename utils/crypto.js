const crypto = require('crypto');

const HASH_SECRET = process.env.JWT_SECRET || 'talent-intel-hash-secret';

/**
 * Generate a SHA-256 hash for a student's trust score.
 * This hash is publicly verifiable via the /verify endpoint.
 */
function generateTrustHash(studentId, trustScore) {
  const payload = `${studentId}:${trustScore}:${HASH_SECRET}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Verify a trust score hash against a student's data.
 * Returns false (instead of crashing) on any mismatch or bad input.
 */
function verifyTrustHash(studentId, trustScore, hash) {
  if (!hash || typeof hash !== 'string') return false;

  const expected = generateTrustHash(studentId, trustScore);
  const expectedBuf = Buffer.from(expected, 'utf8');
  const hashBuf = Buffer.from(hash, 'utf8');

  // timingSafeEqual throws if lengths differ — guard against that
  if (expectedBuf.length !== hashBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, hashBuf);
}

/**
 * Generate QR-compatible data payload for a student's trust score.
 * Returns a JSON string that can be encoded into a QR code by the frontend.
 */
function generateQRData(studentId, fullName, trustScore, hash) {
  return JSON.stringify({
    platform: 'Talent Intel',
    type: 'trust_score_verification',
    student_id: studentId,
    name: fullName,
    trust_score: trustScore,
    hash: hash,
    verify_url: `/api/trust-score/verify/${hash}`,
    generated_at: new Date().toISOString(),
  });
}

module.exports = { generateTrustHash, verifyTrustHash, generateQRData };
