// backend/src/models/Workflow.js

const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: String,
	steps: [
		{
			name: String,
			approvers: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
			actions: [String],
		},
	],
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	tenantId: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Workflow', WorkflowSchema);
