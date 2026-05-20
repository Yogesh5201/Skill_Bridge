const express = require('express');
const router = express.Router();
const userInterestController = require('../controllers/userInterestController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, userInterestController.getUserInterests);
router.post('/', verifyToken, userInterestController.addUserInterest);
router.delete('/:skillId', verifyToken, userInterestController.removeUserInterest);

module.exports = router;
