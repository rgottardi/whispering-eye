// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
	const token = req.cookies.jwt;
	if (!token)
		return res
			.status(401)
			.json({ message: 'Access denied, token missing' });

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(400).json({ message: 'Invalid token' });
	}
};

// Middleware to check user role
exports.checkRole = (roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return res.status(403).send('Access denied');
	}
	next();
};
