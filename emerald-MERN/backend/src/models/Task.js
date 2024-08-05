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
	},
	status: {
		type: String,
		enum: ['Pending', 'In Progress', 'Completed'],
		default: 'Pending',
	},
	tenantId: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Task', TaskSchema);
