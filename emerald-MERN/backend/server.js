// backend/server.js

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
const {
	secureHeaders,
	apiLimiter,
} = require('./src/middleware/securityMiddleware');
const handleTenantId = require('./src/middleware/tenantMiddleware');
require('./src/config/passport-config'); // Ensure passport configuration is loaded

// Connect to the database
connectDB();

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(secureHeaders); // Apply security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(
	morgan('combined', {
		stream: {
			write: (message) => logger.info(message.trim()),
		},
	})
); // Log HTTP requests

// Initialize session for OAuth
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Apply tenant middleware to all API routes
app.use('/api/', handleTenantId); // Ensure requests have tenant context

// Apply rate limiting middleware to all API routes
app.use('/api/', apiLimiter);

// Initialize routes with Socket.IO instance
app.use('/api/v1', require('./src/routes/v1')(server));

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error('Internal Server Error:', { error: err.stack });
	res.status(500).send({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server };
