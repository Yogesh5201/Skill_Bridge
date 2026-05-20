const pool = require('./pool');

const initDb = async () => {
  try {
    // ── Explicit junction tables (avoid Prisma A/B confusion) ──────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_teaching_skills (
        user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        skill_id TEXT NOT NULL REFERENCES "Skill"(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, skill_id)
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_learning_skills (
        user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        skill_id TEXT NOT NULL REFERENCES "Skill"(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, skill_id)
      )
    `);

    // ── Meetings table ─────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meetings (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        description TEXT,
        scheduled_at TIMESTAMPTZ NOT NULL,
        duration_minutes INT NOT NULL DEFAULT 60,
        organizer_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        participant_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'SCHEDULED',
        room_id TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // ── Documents table ────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        size BIGINT,
        mime_type TEXT,
        uploader_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        recipient_id TEXT REFERENCES "User"(id) ON DELETE SET NULL,
        swap_request_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Add recipient_id to existing documents table if column missing
    await pool.query(`
      ALTER TABLE documents ADD COLUMN IF NOT EXISTS recipient_id TEXT REFERENCES "User"(id) ON DELETE SET NULL
    `);

    // ── Seed default skills ────────────────────────────────────────────────
    const skills = [
      ['React', 'Web Dev'], ['Node.js', 'Web Dev'], ['Python', 'Programming'],
      ['JavaScript', 'Web Dev'], ['TypeScript', 'Web Dev'], ['UI/UX Design', 'Design'],
      ['Figma', 'Design'], ['Machine Learning', 'AI'], ['Data Analysis', 'Data'],
      ['DevOps', 'Engineering'], ['Docker', 'Engineering'], ['Flutter', 'Mobile'],
      ['Graphic Design', 'Design'], ['Content Writing', 'Writing'], ['SEO', 'Marketing'],
      ['Digital Marketing', 'Marketing'], ['Video Editing', 'Media'], ['Photography', 'Media'],
      ['Blockchain', 'Engineering'], ['3D Modeling', 'Design'], ['SQL', 'Data'],
      ['AWS', 'Cloud'], ['Cybersecurity', 'Engineering'], ['Public Speaking', 'Soft Skills'],
    ];

    for (const [name, category] of skills) {
      await pool.query(
        `INSERT INTO "Skill" (id, name, category, "createdAt")
         VALUES (gen_random_uuid(), $1, $2, NOW())
         ON CONFLICT (name) DO NOTHING`,
        [name, category]
      );
    }

    console.log('✅  DB initialized — tables ready, skills seeded');
  } catch (err) {
    console.error('❌  DB init error:', err.message);
  }
};

module.exports = initDb;
