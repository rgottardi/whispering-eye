// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token and extract user info
exports.verifyToken = (req, res, next) => {
	const token =
		req.headers.authorization && req.headers.authorization.split(' ')[1];
	if (!token)
		return res.status(401).json({ message: 'Access token required' });

	jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
		if (err) return res.status(403).json({ message: 'Invalid token' });

		try {
			const user = await User.findById(decoded.id);
			if (!user)
				return res.status(404).json({ message: 'User not found' });

			req.user = user;
			req.isSystemAdmin = user.role === 'SystemAdmin';
			next();
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Internal server error', error });
		}
	});
};

// Middleware to check user role
exports.checkRole = (roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return res.status(403).send('Access denied');
	}
	next();
};
