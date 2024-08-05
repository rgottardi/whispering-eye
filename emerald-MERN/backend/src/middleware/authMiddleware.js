// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware to verify token and extract user info
exports.verifyToken = (req, res, next) => {
	const token = req.headers['authorization'];
	if (!token) {
		return res.status(403).send('Access denied, no token provided');
	}

	try {
		const decoded = jwt.verify(
			token.split(' ')[1],
			process.env.JWT_SECRET
		);
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(400).send('Invalid token');
	}
};

// Middleware to check user role
exports.checkRole = (roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return res.status(403).send('Access denied');
	}
	next();
};
