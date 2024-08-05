// backend/src/routes/v1/tasks.js

const express = require('express');
const {
	createTask,
	getTasksForTenant,
} = require('../../controllers/taskController');
const { verifyToken, checkRole } = require('../../middleware/authMiddleware');
const handleTenantId = require('../../middleware/tenantMiddleware');
const logAction = require('../../middleware/auditMiddleware');

const router = express.Router();

// Route to create a task
router.post(
	'/create',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'User']),
	logAction('Create Task'),
	createTask
);

// Route to get tasks for a tenant
router.get(
	'/',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'User']),
	logAction('Get Tasks'),
	getTasksForTenant
);

module.exports = router;

// backend/src/routes/v1/tasks.js

/**
 * @swagger
 * /api/v1/tasks/create:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *                 example: 605c72ef42e2b4c3b34b5b77
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Error creating task
 */
