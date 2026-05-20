const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' });

  try {
    const existing = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'User with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO "User" (id, name, email, password, role, rating, "numReviews", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, 'USER', 0, 0, NOW(), NOW())
       RETURNING id, name, email, role, avatar`,
      [name, email, hashed]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Invalid email or password.' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, avatar, bio, "teachesSummary", "wantsSummary", rating, "numReviews"
       FROM "User" WHERE id = $1`,
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });

    const user = result.rows[0];
    const ts = await pool.query(
      `SELECT s.id, s.name, s.category FROM "Skill" s
       JOIN user_teaching_skills uts ON s.id = uts.skill_id
       WHERE uts.user_id = $1`, [user.id]
    );
    const ls = await pool.query(
      `SELECT s.id, s.name, s.category FROM "Skill" s
       JOIN user_learning_skills uls ON s.id = uls.skill_id
       WHERE uls.user_id = $1`, [user.id]
    );
    user.teachingSkills = ts.rows;
    user.learningSkills = ls.rows;
    res.json(user);
  } catch (err) {
    console.error('GetMe error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
};
