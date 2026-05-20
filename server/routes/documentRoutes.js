const express = require('express');
const router = express.Router();
const docController = require('../controllers/documentController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/upload', verifyToken, docController.uploadMiddleware, docController.uploadDocument);
router.get('/', verifyToken, docController.getDocuments);
router.get('/file/:filename', docController.serveFile);
router.delete('/:id', verifyToken, docController.deleteDocument);

module.exports = router;
