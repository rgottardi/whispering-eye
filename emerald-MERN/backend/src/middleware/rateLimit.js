// backend/src/middleware/rateLimit.js

const rateLimit = require('express-rate-limit');

// Configure rate limiting
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: {
		message: 'Too many requests from this IP, please try again after 15 minutes',
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = apiLimiter;
