const userInterestModel = require('../models/userInterestModel');

const getUserInterests = (req, res) => {
  userInterestModel.getUserInterests(req.user.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

const addUserInterest = (req, res) => {
  const userId = req.user.id;
  const { skillId } = req.body;

  if (!skillId) {
    return res.status(400).json({ error: 'skillId required' });
  }

  userInterestModel.addUserInterest(userId, skillId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: 'Interest added for user' });
  });
};

const removeUserInterest = (req, res) => {
  const userId = req.user.id;
  const { skillId } = req.params;

  userInterestModel.removeUserInterest(userId, skillId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Interest not found for user' });
    }

    res.json({ message: 'Interest removed from user' });
  });
};

module.exports = { getUserInterests, addUserInterest, removeUserInterest };
