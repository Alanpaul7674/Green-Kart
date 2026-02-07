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
  // Check Firebase status
  let firebaseStatus = 'unknown';
  try {
    const admin = require('firebase-admin');
    if (admin.apps.length > 0) {
      firebaseStatus = 'connected';
    } else {
      firebaseStatus = 'not initialized';
    }
  } catch (err) {
    firebaseStatus = 'error: ' + err.message;
  }

  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    firebase: firebaseStatus,
    config: {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    }
  });
};

module.exports = {
  healthCheck,
};
