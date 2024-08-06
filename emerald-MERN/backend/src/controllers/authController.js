// backend/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');

// Helper function to create a JWT token
const createToken = (user) => {
	return jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);
};

// Register a new user
exports.register = async (req, res) => {
	const { firstName, lastName, email, password, role } = req.body;
	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Create a new user instance
		const user = new User({
			firstName,
			lastName,
			email,
			password,
			role: role || 'Viewer',
			tenantId: req.tenantId,
		});

		// Save the user to the database
		await user.save();

		// Generate a token
		const token = createToken(user);

		// Set the token in an HTTP-only cookie
		res.cookie('jwt', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
		});

		// Respond with a success message and user data
		res.status(201).json({ message: 'Registration successful', user });
	} catch (error) {
		logger.error('Error registering user:', { error });
		res.status(500).json({ message: 'Error registering user', error });
	}
};

// Login a user
exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) throw new Error('Invalid email or password');

		// Check if the password matches
		const isMatch = await user.comparePassword(password);
		if (!isMatch) throw new Error('Invalid email or password');

		// Generate a token
		const token = createToken(user);

		// Set the token in an HTTP-only cookie
		res.cookie('jwt', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
		});

		// Respond with a success message and user data
		res.status(200).json({ message: 'Login successful', user });
	} catch (error) {
		logger.error('Error logging in:', { error });
		res.status(400).json({ message: error.message });
	}
};

// Logout a user
exports.logout = (req, res) => {
	// Clear the JWT cookie
	res.cookie('jwt', '', { maxAge: 1 });
	res.status(200).json({ message: 'Logout successful' });
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
	const { email } = req.body;
	try {
		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: 'User not found' });

		// Generate a password reset token
		const resetToken = user.generatePasswordResetToken();
		await user.save();

		// Construct the reset URL
		const resetUrl = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/auth/reset-password/${resetToken}`;

		// Email content
		const message = `You requested a password reset. Please make a PUT request to the following URL to reset your password: \n\n ${resetUrl}`;

		// Send the email
		await sendEmail({
			to: user.email,
			subject: 'Password Reset Request',
			text: message,
		});

		// Respond with a success message
		res.status(200).json({ message: 'Password reset email sent' });
	} catch (error) {
		res.status(500).json({
			message: 'Error requesting password reset',
			error,
		});
	}
};

// Reset password
exports.resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;
	try {
		// Hash the token
		const hashedToken = crypto
			.createHash('sha256')
			.update(token)
			.digest('hex');

		// Find the user by reset token and check expiry
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user)
			return res
				.status(400)
				.json({ message: 'Invalid or expired token' });

		// Update the user's password
		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		// Respond with a success message
		res.status(200).json({ message: 'Password has been reset' });
	} catch (error) {
		res.status(500).json({ message: 'Error resetting password', error });
	}
};
