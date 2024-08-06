// backend/src/routes/v1/users.js

const express = require('express');
const {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
} = require('../../controllers/userController');
const { verifyToken, checkRole } = require('../../middleware/authMiddleware');
const handleTenantId = require('../../middleware/tenantMiddleware');

const router = express.Router();

// Route to get all users in a tenant
router.get(
	'/',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'SystemAdmin']),
	getUsers
);

// Route to create a new user
router.post(
	'/',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'SystemAdmin']),
	createUser
);

// Route to update a user
router.put(
	'/:id',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'SystemAdmin']),
	updateUser
);

// Route to delete a user
router.delete(
	'/:id',
	verifyToken,
	handleTenantId,
	checkRole(['TenantAdmin', 'SystemAdmin']),
	deleteUser
);

module.exports = router;
