// backend/src/controllers/userController.js

const User = require('../models/User');
const logger = require('../utils/logger');

// Get all users
exports.getAllUsers = async (req, res) => {
	try {
		let users;

		if (req.isSystemAdmin) {
			// System admin can see all users
			users = await User.find();
		} else {
			// Tenant admin and users see only their tenant's users
			users = await User.find({ tenantId: req.user.tenantId });
		}

		logger.info('Fetched users', {
			userCount: users.length,
			role: req.user.role,
		});
		res.status(200).json(users);
	} catch (error) {
		logger.error('Error fetching users', { error });
		res.status(500).json({ message: 'Error fetching users', error });
	}
};

// Create a new user
exports.createUser = async (req, res) => {
	const { firstName, lastName, email, password, role } = req.body;
	const tenantId = req.tenantId;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already in use' });
		}

		const newUser = new User({
			firstName,
			lastName,
			email,
			password,
			role,
			tenantId,
		});
		await newUser.save();

		res.status(201).json({
			message: 'User created successfully',
			user: newUser,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error });
	}
};

// Update a user
exports.updateUser = async (req, res) => {
	const { firstName, lastName, email, role } = req.body;
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (email !== user.email) {
			const emailTaken = await User.findOne({ email });
			if (emailTaken) {
				return res
					.status(400)
					.json({ message: 'Email already in use' });
			}
		}

		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.email = email || user.email;
		user.role = role || user.role;

		await user.save();
		res.status(200).json({ message: 'User updated successfully', user });
	} catch (error) {
		res.status(500).json({ message: 'Error updating user', error });
	}
};

// Delete a user
exports.deleteUser = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting user', error });
	}
};
