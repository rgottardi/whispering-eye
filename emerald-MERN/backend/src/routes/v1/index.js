// backend/src/routes/v1/index.js

const express = require('express');
const userRoutes = require('./users');
const taskRoutes = require('./tasks');
const authRoutes = require('./auth');
const notificationRoutes = require('./notifications');
const uploadRoutes = require('./uploads');
const protectedRoutes = require('./protected');

module.exports = (io) => {
	const router = express.Router();

	router.use('/users', userRoutes);
	router.use('/tasks', taskRoutes(io)); // Pass io if needed
	router.use('/auth', authRoutes);
	router.use('/notifications', notificationRoutes);
	router.use('/uploads', uploadRoutes);
	router.use('/protected', protectedRoutes);

	return router;
};
