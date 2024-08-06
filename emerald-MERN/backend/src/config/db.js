// backend/src/config/db.js

const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Function to connect to the MongoDB database
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		logger.info('MongoDB connected successfully');
	} catch (error) {
		logger.error('MongoDB connection failed:', { error });
		process.exit(1); // Exit process with failure
	}
};

module.exports = connectDB;
