// backend/src/config/permissions.js

const permissions = {
	SystemAdmin: [
		'manage_all_tenants',
		'view_global_data',
		'manage_users',
		'manage_tasks',
		'create_tasks',
		'update_tasks',
		'approve_tasks',
	],
	TenantAdmin: [
		'manage_own_tenant',
		'view_own_data',
		'manage_users',
		'manage_tasks',
		'create_tasks',
		'update_tasks',
		'approve_tasks',
	],
	Viewer: ['view_own_data'],
	Creator: ['create_tasks'],
	Approver: ['approve_tasks'],
};

module.exports = permissions;
