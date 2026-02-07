/**
 * Product API Service
 * Functions to interact with product endpoints including carbon footprint data
 */

import api from './api';

// Fallback to local data if API fails
import { allProducts as localProducts, categories as localCategories } from '../data/products';

/**
 * Get all products with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.search - Search query
 * @param {string} params.sort - Sort field (price, ecoScore, carbonFootprint, name)
 * @param {string} params.order - Sort order (asc, desc)
 * @param {string} params.impact - Filter by carbon impact level (Low, Medium, High)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using local data:', error.message);
    // Fallback to local data with basic filtering
    return {
      success: true,
      data: {
        products: localProducts.map(p => ({
          ...p,
          // Add mock carbon data for fallback
          totalCarbonFootprint: Math.random() * 5 + 0.5,
          ecoScore: Math.floor(Math.random() * 40) + 60,
          carbonImpactLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          materialType: 'cotton',
          materialImpact: 1.0,
          transportImpact: 0.5,
          packagingImpact: 0.2,
          recommendations: ['Consider eco-friendly alternatives']
        })),
        pagination: {
          currentPage: 1,
          totalPages: Math.ceil(localProducts.length / 12),
          totalProducts: localProducts.length
        }
      }
    };
  }
};

/**
 * Get a single product by ID
 * @param {string|number} id - Product ID
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    // Backend returns { success, data: { product, similarProducts, carbonBreakdown } }
    // We need to flatten this for the frontend
    if (response.data.success && response.data.data?.product) {
      return {
        success: true,
        data: response.data.data.product,
        similarProducts: response.data.data.similarProducts || [],
        carbonBreakdown: response.data.data.carbonBreakdown
      };
    }
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using local data:', error.message);
    // Fallback to local data
    const product = localProducts.find(p => p.id === parseInt(id));
    if (product) {
      return {
        success: true,
        data: {
          ...product,
          totalCarbonFootprint: Math.random() * 5 + 0.5,
          ecoScore: Math.floor(Math.random() * 40) + 60,
          carbonImpactLevel: 'Low',
          materialType: 'organic_cotton',
          materialImpact: 0.8,
          transportImpact: 0.3,
          packagingImpact: 0.1,
          recommendations: ['This product uses sustainable materials']
        }
      };
    }
    throw new Error('Product not found');
  }
};

/**
 * Get products by carbon impact level
 * @param {string} level - Impact level (Low, Medium, High)
 */
export const getProductsByImpact = async (level) => {
  try {
    const response = await api.get(`/products/impact/${level}`);
    return response.data;
  } catch (error) {
    console.warn('API unavailable:', error.message);
    throw error;
  }
};

/**
 * Get carbon statistics across all products
 */
export const getCarbonStats = async () => {
  try {
    const response = await api.get('/products/stats/carbon');
    return response.data;
  } catch (error) {
    console.warn('API unavailable:', error.message);
    // Return mock stats
    return {
      success: true,
      data: {
        totalProducts: localProducts.length,
        averageCarbonFootprint: 2.5,
        averageEcoScore: 72,
        impactDistribution: {
          low: Math.floor(localProducts.length * 0.4),
          medium: Math.floor(localProducts.length * 0.4),
          high: Math.floor(localProducts.length * 0.2)
        },
        materialBreakdown: {
          bamboo: 20,
          organic_cotton: 30,
          cotton: 25,
          recycled: 15,
          polyester: 10
        }
      }
    };
  }
};

/**
 * Get available categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using local categories');
    return {
      success: true,
      data: localCategories
    };
  }
};

/**
 * Calculate carbon footprint for a product
 * @param {string|number} productId - Product ID
 */
export const calculateCarbonFootprint = async (productId) => {
  try {
    const response = await api.post(`/products/${productId}/calculate-carbon`);
    return response.data;
  } catch (error) {
    console.error('Failed to calculate carbon footprint:', error.message);
    throw error;
  }
};

/**
 * Get similar products (same category, similar eco score)
 * @param {string|number} productId - Current product ID
 * @param {number} limit - Number of similar products to return
 */
export const getSimilarProducts = async (productId, limit = 4) => {
  try {
    const response = await api.get(`/products/${productId}/similar`, { 
      params: { limit } 
    });
    return response.data;
  } catch (error) {
    console.warn('API unavailable for similar products');
    // Fallback - get products from same category
    const currentProduct = localProducts.find(p => p.id === parseInt(productId));
    if (currentProduct) {
      const similar = localProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, limit)
        .map(p => ({
          ...p,
          totalCarbonFootprint: Math.random() * 5 + 0.5,
          ecoScore: Math.floor(Math.random() * 40) + 60,
          carbonImpactLevel: 'Low'
        }));
      return { success: true, data: similar };
    }
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  getProductsByImpact,
  getCarbonStats,
  getCategories,
  calculateCarbonFootprint,
  getSimilarProducts
};
