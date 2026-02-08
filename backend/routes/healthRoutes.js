/**
 * Health Routes
 * API routes for health check endpoints
 */

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Import controller
const { healthCheck } = require('../controllers/healthController');

/**
 * @route   GET /api/health
 * @desc    Check if server is running
 * @access  Public
 */
router.get('/', healthCheck);

/**
 * @route   POST /api/health/test-email
 * @desc    Test email sending
 * @access  Public (for debugging only)
 */
router.post('/test-email', async (req, res) => {
  const { to } = req.body;
  
  if (!to) {
    return res.status(400).json({ success: false, message: 'Email "to" address required' });
  }

  try {
    console.log('Testing email with config:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : '***NOT SET***');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('Email transporter verified successfully');

    // Send test email
    const info = await transporter.sendMail({
      from: `"GreenKart" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'GreenKart Email Test',
      text: 'This is a test email from GreenKart deployed server.',
      html: '<h1>GreenKart Email Test</h1><p>Email is working from the deployed server!</p>',
    });

    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'Email sent successfully', response: info.response });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Email failed', 
      error: error.message,
      code: error.code,
    });
  }
});

module.exports = router;
