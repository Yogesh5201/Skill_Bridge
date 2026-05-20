const db = require('../db/connection');

// assign teaching skill
const addUserSkill = (userId, skillId, callback) => {
  const query = 'INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)';
  db.query(query, [userId, skillId], callback);
};

const getUserSkills = (userId, callback) => {
  const query = `
    SELECT skills.id, skills.name
    FROM user_skills
    JOIN skills ON skills.id = user_skills.skill_id
    WHERE user_skills.user_id = ?
    ORDER BY skills.name ASC
  `;
  db.query(query, [userId], callback);
};

const removeUserSkill = (userId, skillId, callback) => {
  const query = 'DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?';
  db.query(query, [userId, skillId], callback);
};

module.exports = { addUserSkill, getUserSkills, removeUserSkill };
