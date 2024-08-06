// backend/src/middleware/uploadMiddleware.js

const multer = require('multer');

// Configure storage settings for multer
const storage = multer.memoryStorage(); // Store files in memory for direct upload to S3

// Set file filter to only accept certain file types (e.g., images)
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('File type not supported'), false);
	}
};

// Initialize multer
const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB file size limit
});

module.exports = upload;
