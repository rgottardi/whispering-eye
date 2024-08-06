// backend/src/models/Task.js

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	assignedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	status: {
		type: String,
		enum: ['Pending', 'In Progress', 'Completed', 'Approved', 'Rejected'],
		default: 'Pending',
	},
	workflow: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workflow',
	},
	approvals: [
		{
			approver: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			status: {
				type: String,
				enum: ['Pending', 'Approved', 'Rejected'],
				default: 'Pending',
			},
			comment: String,
		},
	],
	tenantId: {
		type: String,
		required: true,
	},
	dueDate: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Task', TaskSchema);
