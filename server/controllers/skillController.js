const pool = require('../db/pool');

exports.getAllSkills = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Skill" ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('getAllSkills error:', err);
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
};

exports.addSkill = async (req, res) => {
  const { name, category } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name is required.' });

  try {
    // Upsert skill
    const result = await pool.query(
      `INSERT INTO "Skill" (id, name, category, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, NOW())
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [name.trim(), category || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addSkill error:', err);
    res.status(500).json({ error: 'Failed to add skill.' });
  }
};
