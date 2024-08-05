// backend/scripts/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
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
				name: 'System Admin',
				email: 'admin@example.com',
				password: 'adminpassword',
				role: 'SystemAdmin',
				username: 'admin', // Ensure this is unique
			},
			{
				name: 'Tenant Admin',
				email: 'tenantadmin@example.com',
				password: 'tenantpassword',
				role: 'TenantAdmin',
				username: 'tenantadmin', // Ensure this is unique
			},
			{
				name: 'Regular User',
				email: 'user@example.com',
				password: 'userpassword',
				role: 'User',
				username: 'user', // Ensure this is unique
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
