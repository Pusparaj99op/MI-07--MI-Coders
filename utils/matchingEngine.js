const { runQuery, runQuerySingle } = require('../db/database');

/**
 * Calculate match score between a student and a job posting.
 * Leverages Neo4j graph traversal for natural skill matching.
 */
async function calculateMatchScore(studentId, jobId) {
  // Get required skills for the job
  const requiredSkills = await runQuery(`
    MATCH (j:JobPosting {id: $jobId})-[r:REQUIRES]->(s:Skill)
    RETURN s.id AS skill_id, s.name AS skill_name, r.min_proficiency AS min_proficiency
  `, { jobId });

  if (requiredSkills.length === 0) {
    return { matchScore: 50, matchedSkills: [], missingSkills: [], details: 'No skills specified' };
  }

  // Get student's skills as a map
  const studentSkills = await runQuery(`
    MATCH (u:User {id: $studentId})-[r:HAS_SKILL]->(s:Skill)
    RETURN s.id AS skill_id, r.proficiency AS proficiency, r.verified AS verified
  `, { studentId });

  const skillMap = new Map();
  for (const s of studentSkills) skillMap.set(s.skill_id, s);

  // Get trust score
  const user = await runQuerySingle(`
    MATCH (u:User {id: $studentId}) RETURN u.trust_score AS trust_score
  `, { studentId });
  const trustScore = user ? (user.trust_score || 0) : 0;

  let total = 0;
  const matchedSkills = [];
  const missingSkills = [];

  for (const req of requiredSkills) {
    const ss = skillMap.get(req.skill_id);
    if (ss) {
      let ratio = Math.min(1.0, ss.proficiency / req.min_proficiency);
      if (ss.verified) ratio = Math.min(1.0, ratio * 1.2);
      total += ratio;
      matchedSkills.push({
        skill: req.skill_name,
        required: req.min_proficiency,
        actual: ss.proficiency,
        verified: !!ss.verified,
        score: Math.round(ratio * 100),
      });
    } else {
      missingSkills.push({ skill: req.skill_name, required: req.min_proficiency });
    }
  }

  const baseScore = (total / requiredSkills.length) * 90;
  const trustBonus = (trustScore / 100) * 10;
  const finalScore = Math.min(100, Math.round((baseScore + trustBonus) * 100) / 100);

  return {
    matchScore: finalScore,
    matchedSkills,
    missingSkills,
    skillCoverage: `${matchedSkills.length}/${requiredSkills.length}`,
    trustScoreBonus: Math.round(trustBonus * 100) / 100,
  };
}

/**
 * Find top matching candidates for a job.
 */
async function findMatchingCandidates(jobId, limit = 20) {
  const students = await runQuery(`
    MATCH (u:User {role: 'student'})
    RETURN u.id AS id, u.full_name AS full_name, u.email AS email,
           u.headline AS headline, u.university AS university, u.trust_score AS trust_score
  `);

  const results = [];
  for (const student of students) {
    const match = await calculateMatchScore(student.id, jobId);
    results.push({ student, ...match });
  }

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results.slice(0, limit);
}

module.exports = { calculateMatchScore, findMatchingCandidates };
