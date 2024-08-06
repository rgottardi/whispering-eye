// backend/src/middleware/tenantMiddleware.js

const handleTenantId = (req, res, next) => {
	// Check if user is a system admin
	if (req.user && req.user.role === 'SystemAdmin') {
		return next(); // System admins don't need a tenant ID
	}

	const tenantId = req.headers['x-tenant-id'];

	if (!tenantId) {
		return res.status(400).json({ message: 'Tenant ID is required' });
	}

	// Store tenantId in request object for further processing
	req.tenantId = tenantId;
	next();
};

module.exports = handleTenantId;
