// backend/src/middleware/permissionMiddleware.js

const permissions = require('../config/permissions');

// Middleware to check if the user has the required permission
const checkPermission = (action) => (req, res, next) => {
	const userRole = req.user.role;
	const rolePermissions = permissions[userRole];

	if (!rolePermissions || !rolePermissions.includes(action)) {
		return res.status(403).send('Access denied');
	}
	next();
};

module.exports = checkPermission;
