// backend/src/routes/v1/tasks.js

const express = require('express');
const {
	createTask,
	getTasksForTenant,
} = require('../../controllers/taskController');
const { verifyToken, checkRole } = require('../../middleware/authMiddleware');
const handleTenantId = require('../../middleware/tenantMiddleware');

const router = express.Router();

// Route to create a task
router.post(
	'/create',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'SystemAdmin']), // Ensure these roles have access
	createTask
);

// Route to get tasks for a tenant
router.get(
	'/',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'SystemAdmin']), // Ensure these roles have access
	getTasksForTenant
);

module.exports = router;
