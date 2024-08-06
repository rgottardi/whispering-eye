// backend/src/routes/v1/auth.js

const express = require('express');
const {
	register,
	login,
	logout, // Add logout function
	requestPasswordReset,
	resetPassword,
} = require('../../controllers/authController');
const passport = require('passport');

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Logout a user
router.post('/logout', logout);

// Request password reset
router.post('/request-password-reset', requestPasswordReset);

// Reset password
router.put('/reset-password/:token', resetPassword);

// Google OAuth login
router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
	res.redirect('/dashboard'); // Redirect to a protected route
});

module.exports = router;
