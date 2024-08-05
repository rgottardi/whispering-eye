// backend/src/middleware/tenantMiddleware.js

const handleTenantId = (req, res, next) => {
	const tenantId = req.headers['x-tenant-id'];

	if (!tenantId) {
		return res.status(400).json({ message: 'Tenant ID is required' });
	}

	// Store tenantId in request object for further processing
	req.tenantId = tenantId;
	next();
};

module.exports = handleTenantId;
