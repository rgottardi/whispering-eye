// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// API Routes
const authRoutes = require('./src/routes/v1/auth');
const protectedRoutes = require('./src/routes/v1/protected');

// Protected API Route
app.use('/api/v1/protected', protectedRoutes);

// Auth API Routes
app.use('/api/v1/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
	res.send('Welcome to Emerald QMS API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
