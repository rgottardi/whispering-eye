// backend/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// Register a new user with role
exports.register = async (req, res) => {
	const { name, email, password, role } = req.body;
	try {
		const user = new User({
			firstName,
			lastName,
			email,
			password,
			role: role || 'User',
		});
		await user.save();
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
		res.status(201).json({ token });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Login a user
exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) throw new Error('Invalid email or password');

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw new Error('Invalid email or password');

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
		res.status(200).json({ token, user }); // Include user data in the response
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: 'User not found' });

		const resetToken = user.generatePasswordResetToken();
		await user.save();

		const resetUrl = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/auth/reset-password/${resetToken}`;
		const message = `You requested a password reset. Please make a PUT request to the following URL to reset your password: \n\n ${resetUrl}`;

		await sendEmail({
			to: user.email,
			subject: 'Password Reset Request',
			text: message,
		});

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
		const hashedToken = crypto
			.createHash('sha256')
			.update(token)
			.digest('hex');
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user)
			return res
				.status(400)
				.json({ message: 'Invalid or expired token' });

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		res.status(200).json({ message: 'Password has been reset' });
	} catch (error) {
		res.status(500).json({ message: 'Error resetting password', error });
	}
};
