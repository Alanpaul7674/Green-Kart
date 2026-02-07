/**
 * Health Route Controller
 * Handles the health check endpoint logic
 */

/**
 * GET /api/health
 * Health check endpoint to verify server is running
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};

module.exports = {
  healthCheck,
};
