// backend/src/controllers/taskController.js

const Task = require('../models/Task');
const User = require('../models/User');
const Workflow = require('../models/Workflow');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');

// Create a new task
exports.createTask = async (req, res) => {
	const { title, description, assignedTo, workflowId, dueDate } = req.body;
	const { tenantId, user } = req;

	try {
		const assignedUser = await User.findOne({
			_id: assignedTo,
			tenantId,
		});
		if (!assignedUser) {
			return res
				.status(404)
				.json({ message: 'Assigned user not found' });
		}

		const workflow = await Workflow.findOne({
			_id: workflowId,
			tenantId,
		});

		const task = new Task({
			title,
			description,
			assignedTo,
			createdBy: user._id,
			workflow: workflow ? workflow._id : null,
			tenantId,
			dueDate,
		});

		if (workflow) {
			task.approvals = workflow.steps.map((step) => ({
				approver: step.approvers[0], // First approver in the step
				status: 'Pending',
			}));
		}

		await task.save();

		// Notify the assigned user
		const notification = new Notification({
			userId: assignedTo,
			message: `You have been assigned a new task: ${title}`,
			tenantId,
		});
		await notification.save();

		await sendEmail({
			to: assignedUser.email,
			subject: 'New Task Assigned',
			text: `You have been assigned a new task: ${title}`,
		});

		res.status(201).json({ message: 'Task created successfully', task });
	} catch (error) {
		logger.error('Error creating task:', { error });
		res.status(500).json({ message: 'Error creating task', error });
	}
};

// Update a task
exports.updateTask = async (req, res) => {
	const { id } = req.params;
	const { title, description, assignedTo, status, dueDate } = req.body;
	const { tenantId } = req;

	try {
		const task = await Task.findOne({ _id: id, tenantId });
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}

		if (assignedTo) {
			const assignedUser = await User.findOne({
				_id: assignedTo,
				tenantId,
			});
			if (!assignedUser) {
				return res
					.status(404)
					.json({ message: 'Assigned user not found' });
			}
			task.assignedTo = assignedTo;
		}

		task.title = title || task.title;
		task.description = description || task.description;
		task.status = status || task.status;
		task.dueDate = dueDate || task.dueDate;
		task.updatedAt = Date.now();

		await task.save();

		res.status(200).json({ message: 'Task updated successfully', task });
	} catch (error) {
		logger.error('Error updating task:', { error });
		res.status(500).json({ message: 'Error updating task', error });
	}
};

// Approve a task step
exports.approveTaskStep = async (req, res) => {
	const { id } = req.params;
	const { comment } = req.body;
	const { tenantId, user } = req;

	try {
		const task = await Task.findOne({ _id: id, tenantId });
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}

		const approval = task.approvals.find(
			(approval) =>
				approval.approver.toString() === user._id.toString() &&
				approval.status === 'Pending'
		);

		if (!approval) {
			return res
				.status(403)
				.json({ message: 'No pending approval found for user' });
		}

		approval.status = 'Approved';
		approval.comment = comment;

		const allApproved = task.approvals.every(
			(approval) => approval.status === 'Approved'
		);
		if (allApproved) {
			task.status = 'Approved';
		}

		await task.save();

		res.status(200).json({ message: 'Task step approved', task });
	} catch (error) {
		logger.error('Error approving task step:', { error });
		res.status(500).json({ message: 'Error approving task step', error });
	}
};
