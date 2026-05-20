const db = require('../db/connection');

const searchUsersBySkill = (skillName, callback) => {
  const query = `
    SELECT
      users.id,
      users.name,
      users.bio,
      skills.name AS teaches,
      GROUP_CONCAT(DISTINCT interests.name) AS wants
    FROM users
    JOIN user_skills ON users.id = user_skills.user_id
    JOIN skills ON skills.id = user_skills.skill_id
    LEFT JOIN user_interests ON users.id = user_interests.user_id
    LEFT JOIN skills AS interests ON interests.id = user_interests.skill_id
    WHERE skills.name LIKE ?
    GROUP BY users.id, users.name, users.bio, skills.name
  `;

  db.query(query, [`%${skillName}%`], callback);
};

module.exports = { searchUsersBySkill };
