const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', skillController.getAllSkills);
router.post('/', verifyToken, skillController.addSkill);

module.exports = router;
