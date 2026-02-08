/**
 * Health Routes
 * API routes for health check endpoints
 */

const express = require('express');
const router = express.Router();

// Import controller and email service
const { healthCheck } = require('../controllers/healthController');
const { sendTestEmail } = require('../services/emailService');

/**
 * @route   GET /api/health
 * @desc    Check if server is running
 * @access  Public
 */
router.get('/', healthCheck);

/**
 * @route   POST /api/health/test-email
 * @desc    Test email sending via Resend API
 * @access  Public (for debugging only)
 */
router.post('/test-email', async (req, res) => {
  const { to } = req.body;
  
  if (!to) {
    return res.status(400).json({ success: false, message: 'Email "to" address required' });
  }

  try {
    console.log('Testing email via Resend API...');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '***SET***' : '***NOT SET***');
    
    const result = await sendTestEmail(to);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: result.mock ? 'Email logged (no API key)' : 'Email sent successfully',
        mock: result.mock || false,
        id: result.id,
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Email failed', 
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Email failed', 
      error: error.message,
    });
  }
});

module.exports = router;
