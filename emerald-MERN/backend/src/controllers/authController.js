// backend/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user with role
exports.register = async (req, res) => {
	const { name, email, password, role } = req.body;
	try {
		const user = new User({
			name,
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
