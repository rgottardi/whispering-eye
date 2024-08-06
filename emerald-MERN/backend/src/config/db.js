// backend/src/config/db.js

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connections = {}; // Cache connections to avoid multiple connections for the same tenant

const connectDB = async (tenantId, isSystemAdmin = false) => {
	// Determine the database URI based on whether the user is a system admin or not
	const dbURI = isSystemAdmin
		? process.env.MONGODB_URI_GLOBAL // Use a global database URI for system admin
		: `${process.env.MONGODB_URI}_${tenantId}`; // Tenant-specific database URI

	if (connections[dbURI]) {
		return connections[dbURI]; // Return existing connection
	}

	try {
		const connection = await mongoose.createConnection(dbURI, {});

		connections[dbURI] = connection; // Cache the connection
		logger.info(
			`MongoDB connected successfully for ${
				isSystemAdmin ? 'global' : `tenant ${tenantId}`
			}`
		);
		return connection;
	} catch (error) {
		logger.error(
			`MongoDB connection failed for ${
				isSystemAdmin ? 'global' : `tenant ${tenantId}`
			}:`,
			{ error }
		);
		process.exit(1);
	}
};

module.exports = connectDB;
