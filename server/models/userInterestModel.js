const db = require('../db/connection');

// assign learning skill
const addUserInterest = (userId, skillId, callback) => {
  const query = 'INSERT INTO user_interests (user_id, skill_id) VALUES (?, ?)';
  db.query(query, [userId, skillId], callback);
};

const getUserInterests = (userId, callback) => {
  const query = `
    SELECT skills.id, skills.name
    FROM user_interests
    JOIN skills ON skills.id = user_interests.skill_id
    WHERE user_interests.user_id = ?
    ORDER BY skills.name ASC
  `;
  db.query(query, [userId], callback);
};

const removeUserInterest = (userId, skillId, callback) => {
  const query = 'DELETE FROM user_interests WHERE user_id = ? AND skill_id = ?';
  db.query(query, [userId, skillId], callback);
};

module.exports = { addUserInterest, getUserInterests, removeUserInterest };
