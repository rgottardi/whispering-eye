// backend/src/routes/v1/notifications.js

const express = require('express');
const Notification = require('../../models/Notification');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();

// Route to get notifications for a user
router.get('/', verifyToken, async (req, res) => {
	try {
		const notifications = await Notification.find({
			userId: req.user.id,
			read: false,
		});
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({
			message: 'Error fetching notifications',
			error,
		});
	}
});

// Route to mark notifications as read
router.put('/:id/read', verifyToken, async (req, res) => {
	try {
		await Notification.findByIdAndUpdate(req.params.id, { read: true });
		res.status(200).json({ message: 'Notification marked as read' });
	} catch (error) {
		res.status(500).json({
			message: 'Error updating notification',
			error,
		});
	}
});

module.exports = router;
