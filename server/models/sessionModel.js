const db = require('../db/connection');

// create session
const createSession = (requestId, scheduledBy, time, callback) => {
  const query = `
    INSERT INTO sessions (request_id, scheduled_by, scheduled_time)
    VALUES (?, ?, ?)
  `;
  db.query(query, [requestId, scheduledBy, time], callback);
};

const getAcceptedRequestForUser = (requestId, userId, callback) => {
  const query = `
    SELECT *
    FROM requests
    WHERE id = ?
      AND status = 'accepted'
      AND (sender_id = ? OR receiver_id = ?)
  `;
  db.query(query, [requestId, userId, userId], callback);
};

// confirm session
const confirmSession = (sessionId, callback) => {
  const query = `
    UPDATE sessions SET status = 'confirmed' WHERE id = ?
  `;
  db.query(query, [sessionId], callback);
};

const getSessionsByUser = (userId, callback) => {
  const query = `
    SELECT
      sessions.*,
      requests.sender_id,
      requests.receiver_id,
      skills.name AS skill_name
    FROM sessions
    JOIN requests ON requests.id = sessions.request_id
    JOIN skills ON skills.id = requests.skill_id
    WHERE requests.sender_id = ? OR requests.receiver_id = ?
    ORDER BY sessions.scheduled_time DESC
  `;
  db.query(query, [userId, userId], callback);
};

const getSessionById = (sessionId, userId, callback) => {
  const query = `
    SELECT
      sessions.*,
      requests.sender_id,
      requests.receiver_id,
      skills.name AS skill_name
    FROM sessions
    JOIN requests ON requests.id = sessions.request_id
    JOIN skills ON skills.id = requests.skill_id
    WHERE sessions.id = ?
      AND (requests.sender_id = ? OR requests.receiver_id = ?)
  `;
  db.query(query, [sessionId, userId, userId], callback);
};

module.exports = {
  createSession,
  getAcceptedRequestForUser,
  confirmSession,
  getSessionsByUser,
  getSessionById
};
