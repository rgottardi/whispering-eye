// backend/src/models/Notification.js

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	read: {
		type: Boolean,
		default: false,
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

module.exports = mongoose.model('Notification', NotificationSchema);
