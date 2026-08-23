const express = require('express');
const router = express.Router();
const { getDBState } = require('../config/db');

// @route   GET /api/health
// @desc    Health check endpoint for Smart Complaint Management API
// @access  Public
router.get('/', (req, res) => {
  const dbStatus = getDBState();
  
  res.status(200).json({
    status: 'OK',
    message: 'Smart Complaint Management API is up and running!',
    service: 'Smart Complaint Server',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      isHealthy: dbStatus === 'connected'
    },
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    }
  });
});

module.exports = router;
