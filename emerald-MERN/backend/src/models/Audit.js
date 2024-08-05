// backend/src/models/Audit.js

const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
	action: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	tenantId: {
		type: String,
		required: true,
	},
	details: {
		type: Object,
	},
});

module.exports = mongoose.model('Audit', AuditSchema);
