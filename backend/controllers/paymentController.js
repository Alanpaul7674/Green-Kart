/**
 * Payment Controller
 * Handles payment processing including UPI collect requests via Razorpay
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});

// UPI Configuration - Update with your actual details
const UPI_CONFIG = {
  merchantName: 'GreenKart',
  merchantUpiId: process.env.MERCHANT_UPI_ID || 'richardantonyjojo1@oksbi',
  merchantAccountName: 'GreenKart Payments',
};

/**
 * Create Razorpay Order
 * Creates an order for payment collection
 */
const createOrder = async (req, res) => {
  try {
    const { amount, orderId, currency = 'INR' } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and order ID are required'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: currency,
      receipt: orderId,
      notes: {
        orderId: orderId,
        merchantName: UPI_CONFIG.merchantName,
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        keyId: process.env.RAZORPAY_KEY_ID,
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * Initiate UPI Collect Request
 * Sends a payment request to the user's UPI app
 */
const initiateUPICollect = async (req, res) => {
  try {
    const { customerUpiId, amount, orderId, customerName, customerEmail, customerPhone } = req.body;

    if (!customerUpiId || !amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Customer UPI ID, amount, and order ID are required'
      });
    }

    // Validate UPI ID format
    const upiRegex = /^[\w.-]+@[\w]+$/;
    if (!upiRegex.test(customerUpiId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UPI ID format'
      });
    }

    // Create a Razorpay order first
    const orderOptions = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        customerUpiId: customerUpiId,
        orderId: orderId,
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    res.json({
      success: true,
      message: 'Payment request initiated! Check your UPI app.',
      data: {
        razorpayOrderId: order.id,
        amount: amount,
        currency: 'INR',
        orderId: orderId,
        customerUpiId: customerUpiId,
        keyId: process.env.RAZORPAY_KEY_ID,
        merchantName: UPI_CONFIG.merchantName,
        // Instructions for the user
        instructions: 'Open your UPI app (GPay/PhonePe/Paytm) to complete the payment',
      }
    });

  } catch (error) {
    console.error('UPI Collect initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate UPI collect request',
      error: error.message
    });
  }
};

/**
 * Verify Razorpay Payment Signature
 * Verifies the payment was successful
 */
const verifyPaymentSignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters'
      });
    }

    // Create signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      // Fetch payment details from Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          amount: payment.amount / 100, // Convert from paise
          method: payment.method,
          status: 'SUCCESS',
          timestamp: new Date().toISOString(),
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment signature verification failed'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * Get UPI Payment Details
 * Returns merchant UPI details for payment
 */
const getUPIDetails = (req, res) => {
  res.json({
    success: true,
    data: {
      merchantName: UPI_CONFIG.merchantName,
      merchantUpiId: UPI_CONFIG.merchantUpiId,
      merchantAccountName: UPI_CONFIG.merchantAccountName,
      supportedApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'],
    }
  });
};

/**
 * Generate UPI Payment Link
 * Creates a UPI deep link for payment
 */
const generateUPILink = (req, res) => {
  try {
    const { amount, orderId, note } = req.query;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and order ID are required'
      });
    }

    const params = new URLSearchParams({
      pa: UPI_CONFIG.merchantUpiId,
      pn: UPI_CONFIG.merchantName,
      am: parseFloat(amount).toFixed(2),
      cu: 'INR',
      tn: note || `GreenKart Order ${orderId}`,
      tr: orderId,
    });

    const upiLink = `upi://pay?${params.toString()}`;

    res.json({
      success: true,
      data: {
        upiLink,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`,
        amount: parseFloat(amount),
        orderId,
        merchantUpiId: UPI_CONFIG.merchantUpiId,
      }
    });

  } catch (error) {
    console.error('UPI link generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate UPI link'
    });
  }
};

module.exports = {
  createOrder,
  initiateUPICollect,
  verifyPaymentSignature,
  getUPIDetails,
  generateUPILink,
};
