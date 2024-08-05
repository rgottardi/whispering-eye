// backend/src/middleware/auditMiddleware.js

const Audit = require('../models/Audit');

const logAction = (action) => async (req, res, next) => {
	const { userId, tenantId } = req; // Extract userId and tenantId from request

	try {
		const audit = new Audit({
			action,
			userId,
			tenantId,
			details: req.body,
		});
		await audit.save();
		next();
	} catch (error) {
		console.error('Error logging action:', error);
		res.status(500).json({ message: 'Error logging action' });
	}
};

module.exports = logAction;
