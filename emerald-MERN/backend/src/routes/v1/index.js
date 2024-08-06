// backend/src/routes/v1/index.js

const express = require('express');
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');
const userRoutes = require('./users');
const uploadRoutes = require('./uploads');
const notificationRoutes = require('./notifications');

module.exports = (io) => {
	const router = express.Router();

	router.use('/auth', authRoutes);
	router.use('/tasks', taskRoutes);
	router.use('/users', userRoutes);
	router.use('/uploads', uploadRoutes);
	router.use('/notifications', notificationRoutes);

	return router;
};
