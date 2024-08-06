// backend/src/middleware/tenantMiddleware.js

const connectDB = require('../config/db');

const handleTenantId = async (req, res, next) => {
	const tenantId = req.headers['x-tenant-id']; // Expect tenant ID in the headers
	const isSystemAdmin = req.headers['x-user-role'] === 'SystemAdmin'; // Check if the user is a system admin

	if (!tenantId && !isSystemAdmin) {
		return res
			.status(400)
			.json({
				message: 'Tenant ID is required unless you are a system admin',
			});
	}

	try {
		// Connect to the appropriate database based on user role
		req.dbConnection = await connectDB(tenantId, isSystemAdmin);
		req.tenantId = tenantId;
		req.isSystemAdmin = isSystemAdmin; // Attach role info for further processing
		next();
	} catch (error) {
		res.status(500).json({
			message: 'Error connecting to database',
			error,
		});
	}
};

module.exports = handleTenantId;
