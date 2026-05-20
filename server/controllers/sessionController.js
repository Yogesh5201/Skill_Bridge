const sessionModel = require('../models/sessionModel');

const getSessions = (req, res) => {
  sessionModel.getSessionsByUser(req.user.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

const getSession = (req, res) => {
  sessionModel.getSessionById(req.params.id, req.user.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const session = results[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json(session);
  });
};

// schedule session
const createSession = (req, res) => {
  const scheduledBy = req.user.id;
  const { requestId, scheduledTime } = req.body;

  if (!requestId || !scheduledTime) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (new Date(scheduledTime) <= new Date()) {
    return res.status(400).json({ error: 'Please choose a future date and time' });
  }

  sessionModel.getAcceptedRequestForUser(requestId, scheduledBy, (err, requests) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!requests[0]) {
      return res.status(400).json({ error: 'Session can only be scheduled for accepted requests' });
    }

    const mysqlScheduledTime = scheduledTime.replace('T', ' ');

    sessionModel.createSession(requestId, scheduledBy, mysqlScheduledTime, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: 'Session scheduled',
        sessionId: result.insertId
      });
    });
  });
};

// confirm session
const confirmSession = (req, res) => {
  const { id } = req.params;

  sessionModel.confirmSession(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session confirmed' });
  });
};

module.exports = { getSessions, getSession, createSession, confirmSession };
