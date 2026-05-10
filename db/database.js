const neo4j = require('neo4j-driver');

const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

let driver;

/**
 * Get or create the Neo4j driver singleton.
 */
function getDriver() {
  if (!driver) {
    driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
  }
  return driver;
}

/**
 * Get a new Neo4j session. Caller MUST close it when done.
 */
function getSession() {
  return getDriver().session();
}

/**
 * Run a single Cypher query in an auto-managed session.
 * Returns an array of record objects (plain JS objects).
 */
async function runQuery(cypher, params = {}) {
  const session = getSession();
  try {
    const result = await session.run(cypher, params);
    return result.records.map((r) => recordToObject(r));
  } finally {
    await session.close();
  }
}

/**
 * Run a single Cypher query and return the first result only (or null).
 */
async function runQuerySingle(cypher, params = {}) {
  const results = await runQuery(cypher, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Run multiple Cypher queries inside a single transaction.
 * txFn receives a `tx` object with `tx.run(cypher, params)`.
 */
async function runTransaction(txFn) {
  const session = getSession();
  try {
    return await session.executeWrite(txFn);
  } finally {
    await session.close();
  }
}

/**
 * Convert a Neo4j Record into a plain JS object.
 * Handles integer conversion (Neo4j integers → JS numbers).
 */
function recordToObject(record) {
  const obj = {};
  record.keys.forEach((key) => {
    obj[key] = convertNeo4jValue(record.get(key));
  });
  return obj;
}

/**
 * Recursively convert Neo4j types to plain JS types.
 */
function convertNeo4jValue(value) {
  if (value === null || value === undefined) return null;

  // Neo4j Integer → JS number
  if (neo4j.isInt(value)) return value.toNumber();

  // Neo4j Node → plain object with its properties
  if (value.constructor && value.constructor.name === 'Node') {
    const props = {};
    for (const [k, v] of Object.entries(value.properties)) {
      props[k] = convertNeo4jValue(v);
    }
    return props;
  }

  // Neo4j Relationship → plain object with its properties
  if (value.constructor && value.constructor.name === 'Relationship') {
    const props = {};
    for (const [k, v] of Object.entries(value.properties)) {
      props[k] = convertNeo4jValue(v);
    }
    return props;
  }

  // Arrays
  if (Array.isArray(value)) return value.map(convertNeo4jValue);

  // Plain objects (e.g. from map projections)
  if (typeof value === 'object' && value.constructor === Object) {
    const props = {};
    for (const [k, v] of Object.entries(value)) {
      props[k] = convertNeo4jValue(v);
    }
    return props;
  }

  return value;
}

/**
 * Initialize the database: create constraints, indexes, and seed data.
 */
async function initializeDatabase() {
  const session = getSession();
  try {
    // ── Uniqueness constraints ──
    await session.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT user_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE');
    await session.run('CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE');
    await session.run('CREATE CONSTRAINT job_id IF NOT EXISTS FOR (j:JobPosting) REQUIRE j.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT app_id IF NOT EXISTS FOR (a:Application) REQUIRE a.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT interview_id IF NOT EXISTS FOR (i:MockInterview) REQUIRE i.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT trust_event_id IF NOT EXISTS FOR (te:TrustEvent) REQUIRE te.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT hire_id IF NOT EXISTS FOR (h:HireRecord) REQUIRE h.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT review_id IF NOT EXISTS FOR (pr:PerformanceReview) REQUIRE pr.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT course_id IF NOT EXISTS FOR (c:CourseCompletion) REQUIRE c.id IS UNIQUE');

    // ── Indexes for performance ──
    await session.run('CREATE INDEX user_role IF NOT EXISTS FOR (u:User) ON (u.role)');
    await session.run('CREATE INDEX job_status IF NOT EXISTS FOR (j:JobPosting) ON (j.status)');
    await session.run('CREATE INDEX skill_category IF NOT EXISTS FOR (s:Skill) ON (s.category)');

    // ── Seed default skills ──
    const { v4: uuidv4 } = require('uuid');
    const skillCount = await session.run('MATCH (s:Skill) RETURN count(s) AS count');
    const count = skillCount.records[0].get('count').toNumber();

    if (count === 0) {
      const defaultSkills = [
        { name: 'JavaScript', category: 'programming' },
        { name: 'Python', category: 'programming' },
        { name: 'Java', category: 'programming' },
        { name: 'TypeScript', category: 'programming' },
        { name: 'C++', category: 'programming' },
        { name: 'Go', category: 'programming' },
        { name: 'Rust', category: 'programming' },
        { name: 'SQL', category: 'programming' },
        { name: 'React', category: 'framework' },
        { name: 'Node.js', category: 'framework' },
        { name: 'Express.js', category: 'framework' },
        { name: 'Next.js', category: 'framework' },
        { name: 'Django', category: 'framework' },
        { name: 'Spring Boot', category: 'framework' },
        { name: 'Flutter', category: 'framework' },
        { name: 'Machine Learning', category: 'data-ai' },
        { name: 'Deep Learning', category: 'data-ai' },
        { name: 'Data Analysis', category: 'data-ai' },
        { name: 'NLP', category: 'data-ai' },
        { name: 'Computer Vision', category: 'data-ai' },
        { name: 'Docker', category: 'devops' },
        { name: 'Kubernetes', category: 'devops' },
        { name: 'AWS', category: 'cloud' },
        { name: 'GCP', category: 'cloud' },
        { name: 'CI/CD', category: 'devops' },
        { name: 'Communication', category: 'soft-skill' },
        { name: 'Leadership', category: 'soft-skill' },
        { name: 'Problem Solving', category: 'soft-skill' },
        { name: 'Teamwork', category: 'soft-skill' },
        { name: 'Project Management', category: 'soft-skill' },
      ];

      const tx = session.beginTransaction();
      try {
        for (const skill of defaultSkills) {
          await tx.run(
            'CREATE (s:Skill {id: $id, name: $name, category: $category, created_at: datetime()})',
            { id: uuidv4(), name: skill.name, category: skill.category }
          );
        }
        await tx.commit();
        console.log(`✅ Seeded ${defaultSkills.length} default skills`);
      } catch (err) {
        await tx.rollback();
        throw err;
      }
    }

    console.log('✅ Neo4j database initialized successfully');
  } finally {
    await session.close();
  }
}

/**
 * Close the Neo4j driver connection.
 */
async function closeDatabase() {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('Neo4j connection closed');
  }
}

module.exports = {
  getDriver,
  getSession,
  runQuery,
  runQuerySingle,
  runTransaction,
  recordToObject,
  convertNeo4jValue,
  initializeDatabase,
  closeDatabase,
};
