// backend/src/routes/v1/protected.js

const express = require('express');
const { verifyToken, checkRole } = require('../../middleware/authMiddleware');
const handleTenantId = require('../../middleware/tenantMiddleware');

const router = express.Router();

// Use handleTenantId middleware
router.get(
	'/dashboard',
	verifyToken,
	handleTenantId,
	checkRole(['SystemAdmin', 'TenantAdmin']),
	(req, res) => {
		res.send(
			`Welcome ${req.user.role} from tenant ${req.tenantId}, you have access to the dashboard.`
		);
	}
);

module.exports = router;
