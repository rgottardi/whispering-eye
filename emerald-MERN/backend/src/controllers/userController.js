// backend/src/controllers/userController.js

const User = require('../models/User');
const Audit = require('../models/Audit');
const logger = require('../utils/logger');

// Get all users
exports.getUsers = async (req, res) => {
	const { tenantId } = req;
	try {
		const users = await User.find({ tenantId });
		res.status(200).json(users);
	} catch (error) {
		logger.error('Error retrieving users:', { error });
		res.status(500).json({ message: 'Error retrieving users', error });
	}
};

// Create a new user
exports.createUser = async (req, res) => {
	const { firstName, lastName, email, password, role } = req.body;
	const { tenantId, user } = req;

	try {
		const newUser = new User({
			firstName,
			lastName,
			email,
			password,
			role,
			tenantId,
		});

		await newUser.save();

		// Audit log for user creation
		await new Audit({
			userId: user._id,
			action: 'Create User',
			details: {
				userId: newUser._id,
				firstName,
				lastName,
				email,
				role,
			},
			tenantId,
		}).save();

		res.status(201).json({
			message: 'User created successfully',
			newUser,
		});
	} catch (error) {
		logger.error('Error creating user:', { error });
		res.status(500).json({ message: 'Error creating user', error });
	}
};

// Update a user
exports.updateUser = async (req, res) => {
	const { id } = req.params;
	const { firstName, lastName, email, role } = req.body;
	const { tenantId, user } = req;

	try {
		const existingUser = await User.findOne({ _id: id, tenantId });
		if (!existingUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		existingUser.firstName = firstName || existingUser.firstName;
		existingUser.lastName = lastName || existingUser.lastName;
		existingUser.email = email || existingUser.email;
		existingUser.role = role || existingUser.role;

		await existingUser.save();

		// Audit log for user update
		await new Audit({
			userId: user._id,
			action: 'Update User',
			details: {
				userId: existingUser._id,
				firstName,
				lastName,
				email,
				role,
			},
			tenantId,
		}).save();

		res.status(200).json({
			message: 'User updated successfully',
			existingUser,
		});
	} catch (error) {
		logger.error('Error updating user:', { error });
		res.status(500).json({ message: 'Error updating user', error });
	}
};

// Delete a user
exports.deleteUser = async (req, res) => {
	const { id } = req.params;
	const { tenantId, user } = req;

	try {
		const userToDelete = await User.findOneAndDelete({
			_id: id,
			tenantId,
		});
		if (!userToDelete) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Audit log for user deletion
		await new Audit({
			userId: user._id,
			action: 'Delete User',
			details: { userId: userToDelete._id, email: userToDelete.email },
			tenantId,
		}).save();

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		logger.error('Error deleting user:', { error });
		res.status(500).json({ message: 'Error deleting user', error });
	}
};
