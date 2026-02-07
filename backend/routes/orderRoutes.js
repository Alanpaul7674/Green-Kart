/**
 * Order Routes
 * API routes for order management
 */

const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getUserOrders } = require('../controllers/orderController');

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Public (should be protected in production)
 */
router.post('/', createOrder);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get order by ID
 * @access  Public
 */
router.get('/:orderId', getOrderById);

/**
 * @route   GET /api/orders/user/:userId
 * @desc    Get all orders for a user
 * @access  Public (should be protected in production)
 */
router.get('/user/:userId', getUserOrders);

module.exports = router;
