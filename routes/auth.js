const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const { runQuery, runQuerySingle } = require('../db/database');
const { generateToken, authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── POST /api/auth/register ────────────────────────────────
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('role').isIn(['student', 'employer']).withMessage('Role must be student or employer'),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { email, password, full_name, role } = req.body;

  const existing = await runQuerySingle('MATCH (u:User {email: $email}) RETURN u.id AS id', { email });
  if (existing) {
    return res.status(409).json({ success: false, error: 'Email already registered' });
  }

  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();

  if (role === 'student') {
    await runQuery(`
      CREATE (u:User {
        id: $id, email: $email, password_hash: $password_hash, role: 'student',
        full_name: $full_name, headline: '', bio: '', university: '', graduation_year: 0,
        resume_url: '', trust_score: 0.0, trust_score_hash: '', github_url: '',
        linkedin_url: '', portfolio_url: '', created_at: $now, updated_at: $now
      })
    `, { id, email, password_hash, full_name, now });
  } else {
    const company_name = req.body.company_name || full_name;
    await runQuery(`
      CREATE (u:User {
        id: $id, email: $email, password_hash: $password_hash, role: 'employer',
        full_name: $full_name, company_name: $company_name, industry: '', company_size: '',
        website: '', description: '', logo_url: '', created_at: $now, updated_at: $now
      })
    `, { id, email, password_hash, full_name, company_name, now });
  }

  const token = generateToken({ id, email, role });

  res.status(201).json({
    success: true,
    data: { user: { id, email, full_name, role }, token },
  });
}));

// ─── POST /api/auth/login ───────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
], asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await runQuerySingle(`
    MATCH (u:User {email: $email})
    RETURN u.id AS id, u.email AS email, u.password_hash AS password_hash,
           u.full_name AS full_name, u.role AS role
  `, { email });

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      token,
    },
  });
}));

// ─── GET /api/auth/me ───────────────────────────────────────
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await runQuerySingle(`
    MATCH (u:User {id: $id})
    RETURN u { .id, .email, .full_name, .role, .created_at,
      .headline, .bio, .university, .graduation_year, .resume_url,
      .trust_score, .trust_score_hash, .github_url, .linkedin_url, .portfolio_url,
      .company_name, .industry, .company_size, .website, .description, .logo_url
    } AS user
  `, { id: req.user.id });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const u = user.user;
  const base = { id: u.id, email: u.email, full_name: u.full_name, role: u.role, created_at: u.created_at };

  let profile;
  if (u.role === 'student') {
    profile = {
      headline: u.headline, bio: u.bio, university: u.university,
      graduation_year: u.graduation_year, resume_url: u.resume_url,
      trust_score: u.trust_score, trust_score_hash: u.trust_score_hash,
      github_url: u.github_url, linkedin_url: u.linkedin_url, portfolio_url: u.portfolio_url,
    };
  } else {
    profile = {
      company_name: u.company_name, industry: u.industry, company_size: u.company_size,
      website: u.website, description: u.description, logo_url: u.logo_url,
    };
  }

  res.json({ success: true, data: { ...base, profile } });
}));

module.exports = router;
