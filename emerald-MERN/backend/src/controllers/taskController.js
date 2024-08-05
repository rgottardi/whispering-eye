// backend/src/controllers/taskController.js

const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Create a new task
exports.createTask = async (req, res) => {
	const { title, description, assignedTo } = req.body;
	const tenantId = req.tenantId;

	try {
		// Check if the assigned user belongs to the same tenant
		const assignedUser = await User.findOne({
			_id: assignedTo,
			tenantId,
		});
		if (!assignedUser) {
			return res
				.status(403)
				.json({
					message: 'Assigned user not found or unauthorized',
				});
		}

		const task = new Task({ title, description, assignedTo, tenantId });
		await task.save();

		// Send email notification
		await sendEmail(
			assignedUser.email,
			'New Task Assigned',
			`You have been assigned a new task: ${title}`
		);

		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: 'Error creating task', error });
	}
};

// Get all tasks for a tenant
exports.getTasksForTenant = async (req, res) => {
	const tenantId = req.tenantId;

	try {
		const tasks = await Task.find({ tenantId });
		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({
			message: 'Error fetching tasks for tenant',
			error,
		});
	}
};
