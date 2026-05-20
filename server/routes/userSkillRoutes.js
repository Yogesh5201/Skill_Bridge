const express = require('express');
const router = express.Router();
const userSkillController = require('../controllers/userSkillController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, userSkillController.getUserSkills);
router.post('/', verifyToken, userSkillController.addUserSkill);
router.delete('/:skillId', verifyToken, userSkillController.removeUserSkill);

module.exports = router;
