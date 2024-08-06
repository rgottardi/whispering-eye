// backend/src/utils/email.js

const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
	try {
		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM, // Sender address
			to, // List of recipients
			subject, // Subject line
			text, // Plain text body
		});

		console.log(`Email sent: ${info.messageId}`);
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

module.exports = sendEmail;
