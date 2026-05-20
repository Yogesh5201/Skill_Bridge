const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, requestController.sendRequest);
router.get('/', verifyToken, requestController.getRequests);
router.put('/:id/status', verifyToken, requestController.updateRequestStatus);

module.exports = router;
