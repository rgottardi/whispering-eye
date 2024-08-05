// backend/src/routes/v1/protected.js

const express = require('express');
const { verifyToken, checkRole } = require('../../middleware/authMiddleware');

const router = express.Router();

// Protected route example
// backend/src/routes/v1/protected.js

router.get(
	'/dashboard',
	verifyToken,
	checkRole(['SystemAdmin', 'TenantAdmin']),
	(req, res) => {
		res.send(
			`Welcome ${req.user.role}, you have access to the dashboard.`
		);
	}
);

module.exports = router;
