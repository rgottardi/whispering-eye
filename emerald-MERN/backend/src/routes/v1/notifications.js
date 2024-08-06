// backend/src/routes/v1/notifications.js

const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const {
	getUserNotifications,
	markNotificationRead,
} = require('../../controllers/notificationController');

const router = express.Router();

// Get all notifications for a user
router.get('/:userId', verifyToken, getUserNotifications);

// Mark notification as read
router.put('/:id/read', verifyToken, markNotificationRead);

module.exports = router;
