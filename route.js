const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const employerRoutes = require('./routes/employers');
const jobRoutes = require('./routes/jobs');
const trustScoreRoutes = require('./routes/trustScore');
const interviewRoutes = require('./routes/interviews');
const feedbackRoutes = require('./routes/feedback');
const skillRoutes = require('./routes/skills');
const courseRoutes = require('./routes/courses');

/**
 * Mount all API routes onto the Express app.
 * @param {import('express').Express} app
 */
function mountRoutes(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/employers', employerRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/trust-score', trustScoreRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/courses', courseRoutes);
}

module.exports = { mountRoutes };
