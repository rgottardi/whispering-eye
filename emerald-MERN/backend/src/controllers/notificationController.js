// backend/src/controllers/notificationController.js

const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
	const { userId } = req.params;

	try {
		const notifications = await Notification.find({ userId }).sort({
			createdAt: -1,
		});
		res.status(200).json(notifications);
	} catch (error) {
		logger.error('Error retrieving notifications:', { error });
		res.status(500).json({
			message: 'Error retrieving notifications',
			error,
		});
	}
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
	const { id } = req.params;

	try {
		const notification = await Notification.findById(id);
		if (!notification) {
			return res
				.status(404)
				.json({ message: 'Notification not found' });
		}

		notification.read = true;
		await notification.save();

		res.status(200).json({
			message: 'Notification marked as read',
			notification,
		});
	} catch (error) {
		logger.error('Error updating notification:', { error });
		res.status(500).json({
			message: 'Error updating notification',
			error,
		});
	}
};
