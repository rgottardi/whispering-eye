// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware to verify token and extract user info
exports.verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res
			.status(403)
			.json({ message: 'Access denied, no token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({ message: 'Invalid token' });
	}
};

// Middleware to check user role
exports.checkRole = (roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return res.status(403).json({ message: 'Access denied' });
	}
	next();
};
