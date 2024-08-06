// backend/src/controllers/analyticsController.js

const Analytics = require('../models/Analytics');
const logger = require('../utils/logger');

// Log an analytics event
exports.logEvent = async (userId, action, details, tenantId) => {
	try {
		await new Analytics({
			userId,
			action,
			details,
			tenantId,
		}).save();
	} catch (error) {
		logger.error('Error logging analytics event:', { error });
	}
};

// Get analytics data
exports.getAnalyticsData = async (req, res) => {
	const { tenantId } = req;

	try {
		const data = await Analytics.find({ tenantId }).sort({
			createdAt: -1,
		});
		res.status(200).json(data);
	} catch (error) {
		logger.error('Error retrieving analytics data:', { error });
		res.status(500).json({
			message: 'Error retrieving analytics data',
			error,
		});
	}
};
