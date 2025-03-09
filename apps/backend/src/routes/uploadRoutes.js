const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../controllers/uploadController');

// POST route for file uploads
router.post('/', uploadFiles);

module.exports = router;

