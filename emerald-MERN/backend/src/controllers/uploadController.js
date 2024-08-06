// backend/src/controllers/uploadController.js

const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../utils/s3Client');
const logger = require('../utils/logger');

// Function to upload file to S3 using AWS SDK v3
exports.uploadFile = async (req, res) => {
	const file = req.file; // Multer will provide the file in req.file

	if (!file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: `uploads/${Date.now()}-${file.originalname}`, // Unique file name
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	try {
		const upload = new Upload({
			client: s3Client,
			params,
		});

		const data = await upload.done();
		logger.info('File uploaded successfully', { url: data.Location });

		res.status(200).json({
			message: 'File uploaded successfully',
			fileUrl: data.Location,
		});
	} catch (error) {
		logger.error('Error uploading file', { error });
		res.status(500).json({ message: 'Error uploading file', error });
	}
};
