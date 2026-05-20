const userSkillModel = require('../models/userSkillModel');

const getUserSkills = (req, res) => {
  userSkillModel.getUserSkills(req.user.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

const addUserSkill = (req, res) => {
  const userId = req.user.id;
  const { skillId } = req.body;

  if (!skillId) {
    return res.status(400).json({ error: 'skillId required' });
  }

  userSkillModel.addUserSkill(userId, skillId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: 'Skill assigned to user' });
  });
};

const removeUserSkill = (req, res) => {
  const userId = req.user.id;
  const { skillId } = req.params;

  userSkillModel.removeUserSkill(userId, skillId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found for user' });
    }

    res.json({ message: 'Skill removed from user' });
  });
};

module.exports = { getUserSkills, addUserSkill, removeUserSkill };
