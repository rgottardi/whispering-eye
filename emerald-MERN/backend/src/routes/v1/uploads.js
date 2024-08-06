// backend/src/routes/v1/uploads.js

const express = require('express');
const uploadMiddleware = require('../../middleware/uploadMiddleware');
const { uploadFile } = require('../../controllers/uploadController');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();

// Route to upload a file
router.post('/', verifyToken, uploadMiddleware.single('file'), uploadFile);

module.exports = router;
