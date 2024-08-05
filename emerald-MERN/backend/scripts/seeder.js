// backend/scripts/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected for seeding');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

// Clear collections
const clearData = async () => {
	try {
		await User.deleteMany();
		console.log('Cleared User collection');
	} catch (error) {
		console.error('Error clearing data:', error);
	}
};

// Seed data
const seedData = async () => {
	try {
		const users = [
			{
				firstName: 'System',
				lastName: 'Admin',
				email: 'admin@example.com',
				password: 'password',
				role: 'SystemAdmin',
				tenantId: 'tenant-1',
			},
			{
				firstName: 'Tenant',
				lastName: 'Admin',
				email: 'tenantadmin1@example.com',
				password: 'password',
				role: 'TenantAdmin',
				tenantId: 'tenant-1',
			},
			{
				firstName: 'Tenant',
				lastName: 'Admin',
				email: 'tenantadmin2@example.com',
				password: 'password',
				role: 'TenantAdmin',
				tenantId: 'tenant-2',
			},
			{
				firstName: 'Regular',
				lastName: 'User',
				email: 'user@example.com',
				password: 'password',
				role: 'User',
				tenantId: 'tenant-1',
			},
			{
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@example.com',
				password: 'password',
				role: 'User',
				tenantId: 'tenant-2',
			},
			{
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane.smith@example.com',
				password: 'password',
				role: 'User',
				tenantId: 'tenant-2',
			},
			{
				firstName: 'Alice',
				lastName: 'Johnson',
				email: 'alice.johnson@example.com',
				password: 'password',
				role: 'User',
				tenantId: 'tenant-1',
			},
			{
				firstName: 'Bob',
				lastName: 'Brown',
				email: 'bob.brown@example.com',
				password: 'password',
				role: 'User',
				tenantId: 'tenant-1',
			},
			{
				firstName: 'Charlie',
				lastName: 'Davis',
				email: 'charlie.davis@example.com',
				password: 'password',
				role: 'User',
				tenantId: 'tenant-2',
			},
			{
				firstName: 'Dana',
				lastName: 'White',
				email: 'dana.white@example.com',
				password: 'password',
				role: 'User',
				tenantId: 'tenant-2',
			},
		];

		// Hash passwords and insert users
		for (let user of users) {
			const newUser = new User(user);
			await newUser.save();
		}

		console.log('Seeded User data');
	} catch (error) {
		console.error('Error seeding data:', error);
	}
};

// Run seeder
const runSeeder = async () => {
	await connectDB();
	await clearData();
	await seedData();
	mongoose.disconnect();
	console.log('Seeder finished');
};

runSeeder();
