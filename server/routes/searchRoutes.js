const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', searchController.searchUsers);
router.get('/users', searchController.searchUsers);

module.exports = router;
