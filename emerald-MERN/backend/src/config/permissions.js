// backend/src/config/permissions.js

const permissions = {
	SystemAdmin: {
		canCreateUser: true,
		canEditUser: true,
		canDeleteUser: true,
		canCreateTask: true,
		canEditTask: true,
		canDeleteTask: true,
		canViewAllTasks: true,
	},
	TenantAdmin: {
		canCreateUser: true,
		canEditUser: true,
		canDeleteUser: true,
		canCreateTask: true,
		canEditTask: true,
		canDeleteTask: true,
		canViewAllTasks: true,
	},
	User: {
		canCreateUser: false,
		canEditUser: false,
		canDeleteUser: false,
		canCreateTask: true,
		canEditTask: true,
		canDeleteTask: false,
		canViewAllTasks: false,
	},
};

module.exports = permissions;
