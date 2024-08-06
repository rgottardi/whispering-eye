// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./src/config/db');
const winston = require('winston');
const expressWinston = require('express-winston');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Configure winston logger
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
		}),
		new winston.transports.File({ filename: 'logs/combined.log' }),
	],
});

// Express-Winston logging middleware
app.use(
	expressWinston.logger({
		transports: [new winston.transports.Console()],
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.json()
		),
	})
);

// Swagger setup
const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Emerald QMS API',
			version: '1.0.0',
			description: 'API Documentation for Emerald QMS',
		},
	},
	apis: ['./src/routes/v1/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes
const routes = require('./src/routes/v1');
const authRoutes = require('./src/routes/v1/auth');
const protectedRoutes = require('./src/routes/v1/protected');
const taskRoutes = require('./src/routes/v1/tasks');
const userRoutes = require('./src/routes/v1/users');

// API Routes
app.use('/api/v1', routes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/protected', protectedRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
	res.send('Welcome to Emerald QMS API');
});

// Express-Winston error-logging middleware
app.use(
	expressWinston.errorLogger({
		transports: [new winston.transports.Console()],
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.json()
		),
	})
);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server }; // Export both app and server
