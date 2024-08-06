// backend/src/controllers/taskController.js

const Notification = require('../models/Notification');
const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');

// Create a new task
exports.createTask = (io) => async (req, res) => {
	const { title, description, assignedTo } = req.body;
	const tenantId = req.tenantId;

	try {
		const assignedUser = await User.findOne({
			_id: assignedTo,
			tenantId,
		});
		if (!assignedUser) {
			logger.warn('Assigned user not found or unauthorized', {
				userId: assignedTo,
				tenantId,
			});
			return res
				.status(403)
				.json({
					message: 'Assigned user not found or unauthorized',
				});
		}

		const task = new Task({ title, description, assignedTo, tenantId });
		await task.save();

		// Create an in-app notification
		const notification = new Notification({
			userId: assignedUser._id,
			message: `You have been assigned a new task: ${title}`,
		});
		await notification.save();

		// Send email notification
		await sendEmail(
			assignedUser.email,
			'New Task Assigned',
			`Dear ${assignedUser.firstName} ${assignedUser.lastName},\nYou have been assigned a new task: ${title}`
		);

		// Send real-time notification using Socket.IO
		io.to(assignedUser._id.toString()).emit('taskAssigned', {
			message: `You have been assigned a new task: ${title}`,
			task,
		});

		logger.info('Task created successfully', { taskId: task._id, title });
		res.status(201).json(task);
	} catch (error) {
		logger.error('Error creating task', { error });
		res.status(400).json({ message: 'Error creating task', error });
	}
};

// Get all tasks for a tenant
exports.getTasksForTenant = async (req, res) => {
	const tenantId = req.tenantId;

	try {
		const tasks = await Task.find({ tenantId });
		logger.info('Fetched tasks for tenant', {
			tenantId,
			count: tasks.length,
		});
		res.status(200).json(tasks);
	} catch (error) {
		logger.error('Error fetching tasks for tenant', { error });
		res.status(500).json({
			message: 'Error fetching tasks for tenant',
			error,
		});
	}
};

// Update a task
exports.updateTask = (io) => async (req, res) => {
	const { id } = req.params;
	const { title, description, assignedTo } = req.body;

	try {
		const task = await Task.findById(id);
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}

		if (title) task.title = title;
		if (description) task.description = description;
		if (assignedTo) task.assignedTo = assignedTo;

		await task.save();
		logger.info('Task updated successfully', { taskId: task._id });

		io.to(task.assignedTo.toString()).emit('taskUpdated', {
			message: `Task has been updated: ${task.title}`,
			task,
		});

		res.status(200).json(task);
	} catch (error) {
		logger.error('Error updating task', { error });
		res.status(500).json({ message: 'Error updating task', error });
	}
};

// Delete a task
exports.deleteTask = (io) => async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.findByIdAndDelete(id);
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}

		logger.info('Task deleted successfully', { taskId: id });

		io.to(task.assignedTo.toString()).emit('taskDeleted', {
			message: `Task has been deleted: ${task.title}`,
		});

		res.status(200).json({ message: 'Task deleted successfully' });
	} catch (error) {
		logger.error('Error deleting task', { error });
		res.status(500).json({ message: 'Error deleting task', error });
	}
};
