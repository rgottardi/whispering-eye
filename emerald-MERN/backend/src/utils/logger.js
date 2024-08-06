// backend/src/utils/logger.js

const { createLogger, format, transports } = require('winston');
const path = require('path');

// Define the format for logs
const logFormat = format.printf(({ timestamp, level, message, ...meta }) => {
	return `${timestamp} [${level}]: ${message} ${
		Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
	}`;
});

// Create a Winston logger
const logger = createLogger({
	level: 'info', // Set default log level
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true }),
		format.splat(),
		format.json(),
		logFormat
	),
	transports: [
		// Console transport for development
		new transports.Console({
			level: 'debug', // Show debug level logs in console
			format: format.combine(
				format.colorize(), // Add color to console logs
				logFormat
			),
		}),
		// File transport for error logs
		new transports.File({
			filename: path.join(__dirname, '../../logs/error.log'),
			level: 'error', // Log errors to this file
		}),
		// File transport for combined logs
		new transports.File({
			filename: path.join(__dirname, '../../logs/combined.log'),
			level: 'info',
		}),
	],
});

// Export the logger
module.exports = logger;
