// backend/src/routes/v1/tasks.js

const express = require('express');
const {
	createTask,
	getTasksForTenant,
	updateTask,
	deleteTask,
} = require('../../controllers/taskController');

const { verifyToken } = require('../../middleware/authMiddleware');
const handleTenantId = require('../../middleware/tenantMiddleware');
const checkPermission = require('../../middleware/permissionMiddleware');

module.exports = (io) => {
	const router = express.Router();

	// Route to create a task
	router.post(
		'/',
		verifyToken,
		handleTenantId,
		checkPermission('canCreateTask'),
		createTask(io)
	);

	// Route to get tasks for a tenant
	router.get(
		'/',
		verifyToken,
		handleTenantId,
		checkPermission('canViewAllTasks'),
		getTasksForTenant
	);

	// Route to update a task
	router.put(
		'/:id',
		verifyToken,
		handleTenantId,
		checkPermission('canEditTask'),
		updateTask(io)
	);

	// Route to delete a task
	router.delete(
		'/:id',
		verifyToken,
		handleTenantId,
		checkPermission('canDeleteTask'),
		deleteTask(io)
	);

	return router;
};
