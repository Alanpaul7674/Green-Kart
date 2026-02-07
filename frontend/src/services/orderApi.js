/**
 * Order API Service
 * Functions to interact with order endpoints
 */

import api from './api';

/**
 * Create a new order
 * @param {Object} orderData - Order details
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Failed to create order:', error.message);
    throw error;
  }
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order:', error.message);
    throw error;
  }
};

/**
 * Get user's orders
 * @param {string} userId - User ID
 */
export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user orders:', error.message);
    throw error;
  }
};

export default {
  createOrder,
  getOrderById,
  getUserOrders,
};
