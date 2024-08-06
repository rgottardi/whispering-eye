// backend/src/routes/v1/auth.js

const express = require('express');
const {
	register,
	login,
	requestPasswordReset,
	resetPassword,
} = require('../../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Request password reset
router.post('/request-password-reset', requestPasswordReset);

// Reset password
router.put('/reset-password/:token', resetPassword);

module.exports = router;
