const db = require('../db/connection');

// send request
const createRequest = (senderId, receiverId, skillId, callback) => {
  const query = `
    INSERT INTO requests (sender_id, receiver_id, skill_id)
    VALUES (?, ?, ?)
  `;
  db.query(query, [senderId, receiverId, skillId], callback);
};

// update request status
const updateRequestStatus = (requestId, status, callback) => {
  const query = `
    UPDATE requests SET status = ? WHERE id = ?
  `;
  db.query(query, [status, requestId], callback);
};

const updateRequestStatusForReceiver = (requestId, receiverId, status, callback) => {
  const query = `
    UPDATE requests
    SET status = ?
    WHERE id = ? AND receiver_id = ?
  `;
  db.query(query, [status, requestId, receiverId], callback);
};

const getIncomingRequests = (userId, callback) => {
  const query = `
    SELECT requests.*, users.name AS sender_name, skills.name AS skill_name
    FROM requests
    JOIN users ON users.id = requests.sender_id
    JOIN skills ON skills.id = requests.skill_id
    WHERE requests.receiver_id = ?
    ORDER BY requests.id DESC
  `;
  db.query(query, [userId], callback);
};

const getOutgoingRequests = (userId, callback) => {
  const query = `
    SELECT requests.*, users.name AS receiver_name, skills.name AS skill_name
    FROM requests
    JOIN users ON users.id = requests.receiver_id
    JOIN skills ON skills.id = requests.skill_id
    WHERE requests.sender_id = ?
    ORDER BY requests.id DESC
  `;
  db.query(query, [userId], callback);
};

module.exports = {
  createRequest,
  updateRequestStatus,
  updateRequestStatusForReceiver,
  getIncomingRequests,
  getOutgoingRequests
};
