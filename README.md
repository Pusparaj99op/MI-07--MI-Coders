# Talent Intel — Backend API

> AI-powered two-sided hiring marketplace connecting students and employers through a shared **skill graph** and cryptographic **Trust Score** system.

Built with **Node.js**, **Express**, and **Neo4j** (graph database).

---

## Quick Start

### Option 1 — Docker (Recommended, one command)

```bash
docker-compose up
```

This starts both **Neo4j** and the **backend API** automatically. Done.

- API: http://localhost:3000
- Neo4j Browser: http://localhost:7474

---

### Option 2 — Manual Setup

#### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Neo4j Desktop](https://neo4j.com/download/) (free) or a running Neo4j instance

#### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start Neo4j
#    Open Neo4j Desktop → Create a new database → Set password to "password" → Click Start

# 4. Start the server
npm start
```

You should see:

```
✅ Seeded 30 default skills
✅ Neo4j database initialized successfully
🚀 Talent Intel API running on http://localhost:3000
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NEO4J_URI` | `bolt://localhost:7687` | Neo4j connection URI |
| `NEO4J_USER` | `neo4j` | Neo4j username |
| `NEO4J_PASSWORD` | `password` | Neo4j password |
| `JWT_SECRET` | — | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register student or employer | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Students
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/students/profile` | Get student profile | Student |
| PUT | `/api/students/profile` | Update student profile | Student |
| POST | `/api/students/resume` | Upload resume URL | Student |
| GET | `/api/students/skills` | List student's skills | Student |
| POST | `/api/students/skills` | Add/update a skill | Student |
| GET | `/api/students/dashboard` | Student dashboard stats | Student |
| GET | `/api/students/applications` | List applications | Student |
| POST | `/api/students/applications` | Apply to a job | Student |

### Employers
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/employers/profile` | Get employer profile | Employer |
| PUT | `/api/employers/profile` | Update employer profile | Employer |
| GET | `/api/employers/dashboard` | Employer dashboard stats | Employer |
| GET | `/api/employers/candidates` | Search candidates | Employer |

### Jobs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | List all active jobs | Public |
| POST | `/api/jobs` | Create a job posting | Employer |
| GET | `/api/jobs/:id` | Get job details | Public |
| PUT | `/api/jobs/:id` | Update a job posting | Employer |
| DELETE | `/api/jobs/:id` | Close a job posting | Employer |
| GET | `/api/jobs/:id/matches` | Get matching candidates | Employer |
| GET | `/api/jobs/:id/applications` | List job applications | Employer |
| PUT | `/api/jobs/:id/applications/:appId` | Update application status | Employer |

### Trust Score
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/trust-score` | Get trust score breakdown | Student |
| GET | `/api/trust-score/qr` | Get QR badge data | Student |
| GET | `/api/trust-score/history` | Event history | Student |
| GET | `/api/trust-score/verify/:hash` | Verify a trust score hash | Public |

### Interviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/interviews` | Record mock interview | Student |
| GET | `/api/interviews` | List interviews | Student |
| GET | `/api/interviews/stats` | Interview statistics | Student |

### Feedback
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/feedback/hire` | Record a hire | Employer |
| POST | `/api/feedback/review` | Submit performance review | Employer |
| GET | `/api/feedback/analytics` | Hiring analytics | Employer |

### Skills and Courses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/skills` | List all skills | Public |
| GET | `/api/skills/categories` | List skill categories | Public |
| GET | `/api/skills/trending` | Trending skills by demand | Public |
| POST | `/api/courses` | Record course completion | Student |
| GET | `/api/courses` | List completed courses | Student |

---

## Architecture

```
talent-intel-backend/
├── server.js                 # Express app + async startup
├── route.js                  # Route aggregator
├── db/
│   └── database.js           # Neo4j driver, sessions, schema init
├── middleware/
│   ├── auth.js               # JWT auth + role guards
│   ├── validate.js           # Express-validator middleware
│   └── errorHandler.js       # Global error handler
├── routes/
│   ├── auth.js               # Register, login, /me
│   ├── students.js           # Profile, skills, applications
│   ├── employers.js          # Profile, dashboard, candidate search
│   ├── jobs.js               # CRUD + matching + applications
│   ├── trustScore.js         # Score breakdown, QR, verify
│   ├── interviews.js         # Mock interviews + stats
│   ├── feedback.js           # Hire, review, analytics
│   ├── skills.js             # Skill catalog
│   └── courses.js            # Course completions
├── utils/
│   ├── trustScoreEngine.js   # Trust score calculation engine
│   ├── matchingEngine.js     # Candidate-job matching algorithm
│   └── crypto.js             # SHA-256 hash + verification
├── docker-compose.yml        # One-command setup (Neo4j + API)
├── Dockerfile                # Container build
└── .env.example              # Environment template
```

## Graph Data Model

The platform uses Neo4j's native graph structure:

- **Users** connected to **Skills** via `HAS_SKILL` relationships
- **Jobs** connected to **Skills** via `REQUIRES` relationships
- **Matching** = graph traversal between student skills and job requirements
- **Trust Score** = aggregated from trust event nodes linked to users

This makes skill matching, candidate search, and relationship queries naturally fast.

---

## Frontend Integration

The API uses standard REST conventions:

- All responses follow `{ success: boolean, data: ... }` format
- Auth via `Authorization: Bearer <token>` header
- CORS is enabled for all origins (dev mode)
- Base URL: `http://localhost:3000/api`

---

## License

MIT
