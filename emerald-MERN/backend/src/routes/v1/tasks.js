// backend/src/routes/v1/tasks.js

const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const checkPermission = require('../../middleware/permissionMiddleware');
const {
	createTask,
	updateTask,
	approveTaskStep,
} = require('../../controllers/taskController');

const router = express.Router();

// Create a task
router.post('/', verifyToken, checkPermission('create_tasks'), createTask);

// Update a task
router.put('/:id', verifyToken, checkPermission('update_tasks'), updateTask);

// Approve a task step
router.post(
	'/:id/approve',
	verifyToken,
	checkPermission('approve_tasks'),
	approveTaskStep
);

module.exports = router;
