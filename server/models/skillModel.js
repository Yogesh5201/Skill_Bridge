const db = require('../db/connection');

// add skill
const createSkill = (name, callback) => {
  const query = 'INSERT INTO skills (name) VALUES (?)';
  db.query(query, [name], callback);
};

const getSkills = (callback) => {
  const query = 'SELECT id, name FROM skills ORDER BY name ASC';
  db.query(query, callback);
};

module.exports = { createSkill, getSkills };
