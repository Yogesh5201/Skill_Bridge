const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, meetingController.getMeetings);
router.post('/', verifyToken, meetingController.createMeeting);
router.put('/:id', verifyToken, meetingController.updateMeeting);
router.delete('/:id', verifyToken, meetingController.deleteMeeting);

module.exports = router;
