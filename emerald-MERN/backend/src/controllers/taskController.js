// backend/src/controllers/taskController.js

const Task = require('../models/Task');
const sendEmail = require('../utils/email');

// Create a new task
exports.createTask = async (req, res) => {
	const { title, description, assignedTo } = req.body;
	const tenantId = req.tenantId;

	try {
		const task = new Task({ title, description, assignedTo, tenantId });
		await task.save();

		// Send email notification
		const assignedUserEmail = 'assigned-user@example.com'; // Retrieve the assigned user's email
		await sendEmail(
			assignedUserEmail,
			'New Task Assigned',
			`You have been assigned a new task: ${title}`
		);

		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: 'Error creating task' });
	}
};

// Get all tasks for a tenant
exports.getTasksForTenant = async (req, res) => {
	const tenantId = req.tenantId;

	try {
		const tasks = await Task.find({ tenantId });
		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching tasks for tenant' });
	}
};
