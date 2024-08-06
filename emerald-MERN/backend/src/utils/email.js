// backend/src/utils/email.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a transporter for sending emails
const sendEmail = async ({ to, subject, text }) => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	// Email options
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: 'recipient@example.com',
		subject: '👋 Hello from Node.js 🚀',
		text: 'This is a test email sent from Node.js using nodemailer. 📧💻',
	};

	await transporter.sendMail(mailOptions);

	// await transporter.sendMail(mailOptions, (error, info) => {
	// 	if (error) {
	// 		console.error('❌ Error:', error.message);
	// 	} else {
	// 		console.log('✅ Email sent:', info.response);
	// 	}
	// });
};

module.exports = sendEmail;
