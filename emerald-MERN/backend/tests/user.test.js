// backend/tests/user.test.js

const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');

jest.setTimeout(20000); // Increase Jest timeout

describe('User Endpoints', () => {
	let token;
	let tenantId = 'tenant-1';
	let userId;

	beforeAll(async () => {
		const res = await request(app).post('/api/v1/auth/login').send({
			email: 'admin@example.com',
			password: 'password',
		});

		if (!res.body.token) {
			throw new Error('Failed to log in admin for tests');
		}

		token = res.body.token;
	});

	afterAll(async () => {
		await mongoose.connection.close();
		server.close();
	});

	it('should create a new user', async () => {
		const res = await request(app)
			.post('/api/v1/users')
			.set('Authorization', `Bearer ${token}`)
			.set('x-tenant-id', tenantId)
			.send({
				firstName: 'Test',
				lastName: 'User',
				email: 'testuser@example.com',
				password: 'password',
				role: 'User',
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body.user).toHaveProperty('firstName', 'Test');
		expect(res.body.user).toHaveProperty('lastName', 'User');
		userId = res.body.user._id;
	});

	it('should fetch all users', async () => {
		const res = await request(app)
			.get('/api/v1/users')
			.set('Authorization', `Bearer ${token}`)
			.set('x-tenant-id', tenantId);

		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('should update a user', async () => {
		const res = await request(app)
			.put(`/api/v1/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tenant-id', tenantId)
			.send({
				firstName: 'Updated',
				lastName: 'User',
				email: 'updateduser@example.com',
				role: 'User',
			});

		expect(res.statusCode).toEqual(200);
		expect(res.body.user).toHaveProperty('firstName', 'Updated');
	});

	it('should delete a user', async () => {
		const res = await request(app)
			.delete(`/api/v1/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tenant-id', tenantId);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty(
			'message',
			'User deleted successfully'
		);
	});
});
