// backend/src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['SystemAdmin', 'TenantAdmin', 'User'],
		default: 'User',
	},
	tenantId: {
		type: String,
		required: function () {
			return this.role !== 'SystemAdmin'; // Tenant ID is required unless the user is a system admin
		},
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex');
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
	return resetToken;
};

// Password verification method
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
