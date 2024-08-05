// backend/tests/setup.js

jest.mock('nodemailer', () => ({
	createTransport: () => ({
		sendMail: jest.fn().mockResolvedValue(true),
	}),
}));
