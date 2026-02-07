/**
 * Payment Routes
 * Handles UPI and Razorpay payment endpoints
 */

const express = require('express');
const router = express.Router();
const { 
  createOrder,
  initiateUPICollect,
  verifyPaymentSignature,
  getUPIDetails, 
  generateUPILink 
} = require('../controllers/paymentController');

// Get merchant UPI details
router.get('/upi/details', getUPIDetails);

// Generate UPI payment link with QR code
router.get('/upi/link', generateUPILink);

// Create Razorpay order
router.post('/create-order', createOrder);

// Initiate UPI collect request (sends payment request to user's UPI app)
router.post('/upi/collect', initiateUPICollect);

// Verify Razorpay payment signature
router.post('/verify', verifyPaymentSignature);

module.exports = router;
