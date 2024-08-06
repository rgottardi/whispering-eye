// backend/src/middleware/permissionMiddleware.js

const permissions = require('../config/permissions');

// Middleware to check if the user has the required permission
const checkPermission = (action) => {
	return (req, res, next) => {
		const userRole = req.user.role;
		const rolePermissions = permissions[userRole];

		if (rolePermissions && rolePermissions[action]) {
			return next();
		} else {
			return res
				.status(403)
				.json({
					message: 'Forbidden: You do not have the required permissions.',
				});
		}
	};
};

module.exports = checkPermission;
