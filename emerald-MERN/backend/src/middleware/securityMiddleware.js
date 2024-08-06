// backend/src/middleware/securityMiddleware.js

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply security-related HTTP headers
const secureHeaders = helmet({
	contentSecurityPolicy: false, // Customize CSP based on your needs
});

// Rate limiting middleware
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
});

module.exports = {
	secureHeaders,
	apiLimiter,
};
