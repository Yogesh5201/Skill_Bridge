const pool = require('../db/pool');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
  const { skill } = req.query;
  // Optionally exclude self if authenticated
  let selfId = null;
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'supersecretjwtkey');
      selfId = decoded.id;
    }
  } catch {}

  try {
    let users;
    if (skill && skill.trim()) {
      const result = await pool.query(
        `SELECT DISTINCT u.id, u.name, u.avatar, u.bio, u.role, u.rating, u."numReviews",
                u."teachesSummary", u."wantsSummary"
         FROM "User" u
         JOIN user_teaching_skills uts ON u.id = uts.user_id
         JOIN "Skill" s ON s.id = uts.skill_id
         WHERE LOWER(s.name) LIKE LOWER($1) AND u.id != $2
         ORDER BY u.rating DESC`,
        [`%${skill.trim()}%`, selfId || '']
      );
      users = result.rows;
    } else {
      const result = await pool.query(
        `SELECT id, name, avatar, bio, role, rating, "numReviews",
                "teachesSummary", "wantsSummary"
         FROM "User"
         WHERE id != $1
         ORDER BY rating DESC, "createdAt" DESC
         LIMIT 50`,
        [selfId || '']
      );
      users = result.rows;
    }

    // Attach skills
    for (const user of users) {
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
      // Derived display fields
      user.teaches = ts.rows.map(s => s.name).join(', ') || user.teachesSummary || '';
      user.wants = ls.rows.map(s => s.name).join(', ') || user.wantsSummary || '';
    }

    res.json(users);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, avatar, bio, role, rating, "numReviews", "teachesSummary", "wantsSummary"
       FROM "User" WHERE id = $1`,
      [req.params.id]
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
    user.teaches = ts.rows.map(s => s.name).join(', ');
    user.wants = ls.rows.map(s => s.name).join(', ');
    res.json(user);
  } catch (err) {
    console.error('getUserById error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, bio, teachesSummary, wantsSummary, avatar, teachingSkillIds, learningSkillIds } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE "User" SET name=$1, bio=$2, "teachesSummary"=$3, "wantsSummary"=$4, avatar=$5, "updatedAt"=NOW()
       WHERE id=$6`,
      [name || null, bio || null, teachesSummary || null, wantsSummary || null, avatar || null, userId]
    );

    // Update teaching skills
    if (Array.isArray(teachingSkillIds)) {
      await pool.query(`DELETE FROM user_teaching_skills WHERE user_id = $1`, [userId]);
      for (const sid of teachingSkillIds) {
        await pool.query(
          `INSERT INTO user_teaching_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [userId, sid]
        );
      }
    }

    // Update learning skills
    if (Array.isArray(learningSkillIds)) {
      await pool.query(`DELETE FROM user_learning_skills WHERE user_id = $1`, [userId]);
      for (const sid of learningSkillIds) {
        await pool.query(
          `INSERT INTO user_learning_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [userId, sid]
        );
      }
    }

    // Return updated user with skills
    const result = await pool.query(
      `SELECT id, name, avatar, bio, role, rating, "numReviews", "teachesSummary", "wantsSummary"
       FROM "User" WHERE id = $1`, [userId]
    );
    const user = result.rows[0];
    const ts = await pool.query(
      `SELECT s.id, s.name, s.category FROM "Skill" s
       JOIN user_teaching_skills uts ON s.id = uts.skill_id
       WHERE uts.user_id = $1`, [userId]
    );
    const ls = await pool.query(
      `SELECT s.id, s.name, s.category FROM "Skill" s
       JOIN user_learning_skills uls ON s.id = uls.skill_id
       WHERE uls.user_id = $1`, [userId]
    );
    user.teachingSkills = ts.rows;
    user.learningSkills = ls.rows;
    res.json(user);
  } catch (err) {
    console.error('updateProfile error:', err.message);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};
