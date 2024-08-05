// backend/tests/tasks.test.js

const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');

jest.setTimeout(20000); // Increase Jest timeout to 20 seconds

describe('Task Endpoints', () => {
	let token;
	let tenantId = 'tenant-1'; // Use a valid tenant ID for testing

	beforeAll(async () => {
		// Authenticate and get a token for testing
		const res = await request(app).post('/api/v1/auth/login').send({
			email: 'admin@example.com',
			password: 'adminpassword',
		});

		token = res.body.token;
	});

	afterAll(async () => {
		await mongoose.connection.close(); // Close Mongoose connection
		server.close(); // Close server after tests
	});

	it('should create a new task', async () => {
		// Fetch a valid user ID from the database to use in the test
		const userRes = await request(app).post('/api/v1/auth/login').send({
			email: 'user@example.com',
			password: 'userpassword',
		});

		const userId = userRes.body.user._id; // Ensure the login response contains user info

		const res = await request(app)
			.post('/api/v1/tasks/create')
			.set('Authorization', `Bearer ${token}`)
			.set('x-tenant-id', tenantId)
			.send({
				title: 'Test Task',
				description: 'This is a test task.',
				assignedTo: userId,
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('title', 'Test Task');
	});

	it('should fetch tasks for a tenant', async () => {
		const res = await request(app)
			.get('/api/v1/tasks')
			.set('Authorization', `Bearer ${token}`)
			.set('x-tenant-id', tenantId);

		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});
