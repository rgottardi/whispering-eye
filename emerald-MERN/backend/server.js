// backend/server.js

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
const apiLimiter = require('./src/middleware/rateLimit');

// Load environment variables
dotenv.config();

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*', // Allow all origins for simplicity; refine for production
	},
});

// Middleware
app.use(helmet()); // Security best practices
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(
	morgan('combined', {
		stream: {
			write: (message) => logger.info(message.trim()),
		},
	})
); // Log HTTP requests

// Connect to MongoDB
connectDB();

// Apply rate limiting middleware to all API routes
app.use('/api/', apiLimiter);

// Initialize routes with Socket.IO instance
app.use('/api/v1', require('./src/routes/v1')(io));

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error('Internal Server Error:', { error: err.stack });
	res.status(500).send({ message: 'Internal Server Error' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
	logger.info('New client connected', { socketId: socket.id });

	socket.on('disconnect', () => {
		logger.info('Client disconnected', { socketId: socket.id });
	});
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server };
