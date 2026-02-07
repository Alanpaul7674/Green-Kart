/**
 * Health Routes
 * API routes for health check endpoints
 */

const express = require('express');
const router = express.Router();

// Import controller
const { healthCheck } = require('../controllers/healthController');

/**
 * @route   GET /api/health
 * @desc    Check if server is running
 * @access  Public
 */
router.get('/', healthCheck);

module.exports = router;
