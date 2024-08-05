// backend/src/utils/email.js

const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
	host: 'smtp.example.com', // Replace with a valid SMTP host
	port: 587,
	secure: false,
	auth: {
		user: 'your-email@example.com', // Replace with your email
		pass: 'your-email-password', // Replace with your email password
	},
});

// Send an email
const sendEmail = async (to, subject, text) => {
	try {
		await transporter.sendMail({
			from: '"Emerald QMS" <your-email@example.com>', // Replace with your email
			to,
			subject,
			text,
		});
		console.log(`Email sent to ${to}`);
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

module.exports = sendEmail;
