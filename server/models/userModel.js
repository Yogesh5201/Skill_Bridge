const db = require('../db/connection');

// insert user
const createUser = (name, email, bio, password, callback) => {
  const query = `
    INSERT INTO users (name, email, bio, password)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [name, email, bio, password], callback);
};

// fetch user
const getUserById = (id, callback) => {
  const query = `
    SELECT
      users.id,
      users.name,
      users.email,
      users.bio,
      GROUP_CONCAT(DISTINCT CONCAT(teaching_skills.id, ':', teaching_skills.name) ORDER BY teaching_skills.name SEPARATOR '||') AS teachingSkillsRaw,
      GROUP_CONCAT(DISTINCT CONCAT(learning_skills.id, ':', learning_skills.name) ORDER BY learning_skills.name SEPARATOR '||') AS learningInterestsRaw,
      GROUP_CONCAT(DISTINCT teaching_skills.name ORDER BY teaching_skills.name SEPARATOR ', ') AS teaches,
      GROUP_CONCAT(DISTINCT learning_skills.name ORDER BY learning_skills.name SEPARATOR ', ') AS wants
    FROM users
    LEFT JOIN user_skills ON users.id = user_skills.user_id
    LEFT JOIN skills AS teaching_skills ON teaching_skills.id = user_skills.skill_id
    LEFT JOIN user_interests ON users.id = user_interests.user_id
    LEFT JOIN skills AS learning_skills ON learning_skills.id = user_interests.skill_id
    WHERE users.id = ?
    GROUP BY users.id, users.name, users.email, users.bio
  `;
  db.query(query, [id], callback);
};

const updateUser = (id, name, email, bio, callback) => {
  const query = `
    UPDATE users
    SET name = ?, email = ?, bio = ?
    WHERE id = ?
  `;
  db.query(query, [name, email, bio, id], callback);
};

module.exports = { createUser, getUserById, updateUser };
