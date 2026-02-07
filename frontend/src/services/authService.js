/**
 * Authentication Service
 * API calls for user authentication
 */

import api from './api';

/**
 * Register a new user
 * @param {object} userData - { name, email, password }
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Login user
 * @param {object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Get current user profile
 */
export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
