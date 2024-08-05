// backend/tests/tasks.test.js

const request = require('supertest');
const app = require('../server'); // Ensure your server exports the app instance
const mongoose = require('mongoose');

describe('Task Endpoints', () => {
	let token;
	let tenantId;

	beforeAll(async () => {
		// Authenticate and get a token for testing
		const res = await request(app).post('/api/v1/auth/login').send({
			email: 'admin@example.com',
			password: 'adminpassword',
		});

		token = res.body.token;
		tenantId = 'your-tenant-id'; // Use a valid tenant ID for testing
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	it('should create a new task', async () => {
		const res = await request(app)
			.post('/api/v1/tasks/create')
			.set('Authorization', `Bearer ${token}`)
			.set('x-tenant-id', tenantId)
			.send({
				title: 'Test Task',
				description: 'This is a test task.',
				assignedTo: '605c72ef42e2b4c3b34b5b77', // Use a valid user ID
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
