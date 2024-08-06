// backend/src/routes/v1/analytics.js

const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const { getAnalyticsData } = require('../../controllers/analyticsController');

const router = express.Router();

// Get analytics data for a tenant
router.get('/', verifyToken, getAnalyticsData);

module.exports = router;
