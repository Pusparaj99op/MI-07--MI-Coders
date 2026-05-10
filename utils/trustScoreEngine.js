const { v4: uuidv4 } = require('uuid');
const { runQuery, runQuerySingle } = require('../db/database');
const { generateTrustHash } = require('./crypto');

/**
 * Point values for each trust-score event type.
 */
const EVENT_POINTS = {
  'resume_uploaded':       10,
  'skill_self_assessed':   2,
  'skill_verified':        15,
  'mock_interview_easy':   5,
  'mock_interview_medium': 10,
  'mock_interview_hard':   15,
  'course_completed':      10,
  'application_submitted': 3,
  'hired':                 25,
  'review_positive':       20,
  'review_neutral':        5,
  'review_negative':       -10,
};

const MAX_POINTS_BASELINE = 200;

/**
 * Record a trust score event and recalculate the student's score.
 */
async function recordTrustEvent(studentId, eventType, metadata = {}) {
  const points = EVENT_POINTS[eventType];
  if (points === undefined) {
    throw Object.assign(new Error(`Unknown event type: ${eventType}`), { statusCode: 400 });
  }

  const eventId = uuidv4();

  // Create TrustEvent node linked to the User
  await runQuery(`
    MATCH (u:User {id: $studentId})
    CREATE (u)-[:HAS_TRUST_EVENT]->(te:TrustEvent {
      id: $eventId,
      event_type: $eventType,
      points: $points,
      metadata: $metadata,
      created_at: datetime()
    })
  `, { studentId, eventId, eventType, points, metadata: JSON.stringify(metadata) });

  const result = await recalculateTrustScore(studentId);

  return {
    event: { id: eventId, event_type: eventType, points },
    newScore: result.score,
    hash: result.hash,
  };
}

/**
 * Recalculate a student's trust score from all their events.
 */
async function recalculateTrustScore(studentId) {
  const row = await runQuerySingle(`
    MATCH (u:User {id: $studentId})-[:HAS_TRUST_EVENT]->(te:TrustEvent)
    RETURN COALESCE(sum(te.points), 0) AS total_points
  `, { studentId });

  const totalPoints = Math.max(0, row ? row.total_points : 0);
  const score = Math.min(100, (totalPoints / MAX_POINTS_BASELINE) * 100);
  const roundedScore = Math.round(score * 100) / 100;
  const hash = generateTrustHash(studentId, roundedScore);

  // Update user's trust_score and hash
  await runQuery(`
    MATCH (u:User {id: $studentId})
    SET u.trust_score = $score, u.trust_score_hash = $hash
  `, { studentId, score: roundedScore, hash });

  return { score: roundedScore, hash, totalPoints };
}

/**
 * Get a detailed breakdown of a student's trust score.
 */
async function getTrustScoreBreakdown(studentId) {
  const user = await runQuerySingle(`
    MATCH (u:User {id: $studentId})
    WHERE u.role = 'student'
    RETURN u.trust_score AS trust_score, u.trust_score_hash AS trust_score_hash
  `, { studentId });

  if (!user) {
    throw Object.assign(new Error('Student profile not found'), { statusCode: 404 });
  }

  const breakdown = await runQuery(`
    MATCH (u:User {id: $studentId})-[:HAS_TRUST_EVENT]->(te:TrustEvent)
    RETURN te.event_type AS event_type,
           sum(te.points) AS total_points,
           count(te) AS event_count
    ORDER BY total_points DESC
  `, { studentId });

  const history = await runQuery(`
    MATCH (u:User {id: $studentId})-[:HAS_TRUST_EVENT]->(te:TrustEvent)
    RETURN te.id AS id, te.event_type AS event_type, te.points AS points,
           te.metadata AS metadata, toString(te.created_at) AS created_at
    ORDER BY te.created_at DESC
    LIMIT 50
  `, { studentId });

  const parsedHistory = history.map((e) => ({
    ...e,
    metadata: JSON.parse(e.metadata || '{}'),
  }));

  return {
    score: user.trust_score || 0,
    hash: user.trust_score_hash || '',
    breakdown,
    recentHistory: parsedHistory,
  };
}

module.exports = {
  EVENT_POINTS,
  recordTrustEvent,
  recalculateTrustScore,
  getTrustScoreBreakdown,
};
