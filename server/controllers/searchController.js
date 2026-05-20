const searchModel = require('../models/searchModel');

const searchUsers = (req, res) => {
  const skill = req.query.skill || req.query.q;

  if (!skill) {
    return res.status(400).json({ error: 'Skill required' });
  }

  searchModel.searchUsersBySkill(skill, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const users = results.map((user) => ({
      id: user.id,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar || null,
      teaches: user.teaches,
      wants: user.wants || 'Learning',
      role: 'User',
      rating: user.rating || 'New',
      status: 'Online'
    }));

    res.json(users);
  });
};

module.exports = { searchUsers };
