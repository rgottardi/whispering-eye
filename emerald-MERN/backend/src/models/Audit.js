// backend/src/models/Audit.js

const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	action: {
		type: String,
		required: true,
	},
	details: {
		type: mongoose.Schema.Types.Mixed,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	tenantId: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Audit', AuditSchema);
