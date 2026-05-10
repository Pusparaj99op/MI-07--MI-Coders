require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeDatabase, closeDatabase } = require('./db/database');
const { mountRoutes } = require('./route');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Core Middleware ────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger (dev) ───────────────────────────────────
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── Health Check ───────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    platform: 'Talent Intel',
    version: '2.0.0',
    database: 'Neo4j',
    status: 'operational',
    description: 'Unified two-sided platform connecting students and employers through a shared skill graph and Trust Score',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      employers: '/api/employers',
      jobs: '/api/jobs',
      trust_score: '/api/trust-score',
      interviews: '/api/interviews',
      feedback: '/api/feedback',
      skills: '/api/skills',
      courses: '/api/courses',
    },
  });
});

// ─── API Routes ─────────────────────────────────────────────
mountRoutes(app);

// ─── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ─── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// ─── Start Server (async for Neo4j init) ────────────────────
async function start() {
  try {
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Talent Intel API running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: Neo4j @ ${process.env.NEO4J_URI || 'bolt://localhost:7687'}`);
      console.log(`🔗 API docs: http://localhost:${PORT}/\n`);
    });

    // ─── Graceful Shutdown ──────────────────────────────────
    const shutdown = async () => {
      console.log('\nShutting down...');
      await closeDatabase();
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.error('\nMake sure Neo4j is running at', process.env.NEO4J_URI || 'bolt://localhost:7687');
    console.error('You can start Neo4j with: docker run -d -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest');
    process.exit(1);
  }
}

start();

module.exports = app;
