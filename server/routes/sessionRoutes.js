const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// list sessions for logged-in user
router.get('/', sessionController.getSessions);
router.get('/:id', sessionController.getSession);

// create session
router.post('/', sessionController.createSession);

// confirm session
router.patch('/:id', sessionController.confirmSession);

module.exports = router;
