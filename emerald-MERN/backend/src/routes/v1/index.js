// backend/src/routes/v1/index.js

const express = require('express');
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');
const userRoutes = require('./users'); // Ensure this is imported

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes); // Ensure this is registered

module.exports = router;
