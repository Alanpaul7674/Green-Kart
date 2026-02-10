/**
 * Product Routes
 * ==============
 * 
 * This file defines all API routes for product operations.
 * All routes are prefixed with /api/products
 * 
 * Available Endpoints:
 * - GET /api/products              - Get all products with filtering/pagination
 * - GET /api/products/categories   - Get all product categories
 * - GET /api/products/stats/carbon - Get carbon footprint statistics
 * - GET /api/products/impact/:level - Get products by impact level (Low/Medium/High)
 * - GET /api/products/:id          - Get single product by ID
 * - POST /api/products/:id/calculate-carbon - Calculate carbon footprint for a product
 * 
 * Author: GreenKart Team
 * Version: 1.0.0
 * For: Final Year Project Evaluation
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllProducts,
  getProductById,
  calculateCarbonFootprint,
  getProductsByImpact,
  getCarbonStats,
  getCategories,
  getSimilarProducts,
  createProduct,
} = require('../controllers/productController');

// ==============================================================================
// ROUTE DEFINITIONS
// ==============================================================================

/**
 * @route   GET /api/products
 * @desc    Get all products with optional filtering and pagination
 * @access  Public
 * 
 * Query Parameters:
 * - category: Filter by category (e.g., "Shirts", "Jeans")
 * - impactLevel: Filter by carbon impact ("Low", "Medium", "High")
 * - search: Search in product name/description
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - ecoFriendly: Filter eco-friendly products only (true/false)
 * - sortBy: Sort field (price, ecoScore, carbonFootprint, name)
 * - order: Sort order (asc, desc)
 * - page: Page number (default: 1)
 * - limit: Products per page (default: 12)
 * 
 * Example: GET /api/products?category=Shirts&impactLevel=Low&sortBy=ecoScore&order=desc
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/categories
 * @desc    Get all available product categories
 * @access  Public
 * 
 * Returns: Array of category names
 * Example Response: ["Shirts", "T-Shirts", "Jeans", "Dresses", ...]
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/products/stats/carbon
 * @desc    Get aggregate carbon footprint statistics
 * @access  Public
 * 
 * Returns:
 * - Total products count
 * - Products by impact level (Low/Medium/High)
 * - Average carbon footprint
 * - Average eco score
 * - Stats by category
 */
router.get('/stats/carbon', getCarbonStats);

/**
 * @route   GET /api/products/impact/:level
 * @desc    Get products filtered by carbon impact level
 * @access  Public
 * 
 * Parameters:
 * - level: "Low", "Medium", or "High"
 * 
 * Example: GET /api/products/impact/Low
 */
router.get('/impact/:level', getProductsByImpact);

/**
 * @route   GET /api/products/:id/similar
 * @desc    Get similar products based on category
 * @access  Public
 * 
 * Query Parameters:
 * - limit: Number of similar products to return (default: 4)
 * 
 * Example: GET /api/products/1/similar?limit=4
 */
router.get('/:id/similar', getSimilarProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID with carbon footprint details
 * @access  Public
 * 
 * Returns:
 * - Full product details
 * - Carbon footprint breakdown (material, transport, packaging)
 * - Similar products in the same category
 * 
 * Example: GET /api/products/1
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products/:id/calculate-carbon
 * @desc    Calculate/recalculate carbon footprint using AI service
 * @access  Public
 * 
 * This endpoint calls the Python AI service to calculate
 * the carbon footprint based on product attributes.
 * 
 * If AI service is unavailable, falls back to local calculation.
 * 
 * Example: POST /api/products/1/calculate-carbon
 */
router.post('/:id/calculate-carbon', calculateCarbonFootprint);

/**
 * @route   POST /api/products
 * @desc    Create a new product with AI-predicted carbon footprint
 * @access  Admin
 * 
 * Required Body:
 * - name: Product name (e.g., "T-Shirt")
 * - material: Material type (cotton, polyester, recycled)
 * - country: Country of origin (e.g., "India", "China", "USA")
 * 
 * Optional Body:
 * - weight: Product weight in kg (default: 0.5)
 * - category: Category (default: "Topwear")
 * - price: Price in INR (default: 999)
 * - image: Image URL (default: placeholder)
 * - color, size, description, transport_distance, waste_percent
 * 
 * The AI model predicts the carbon footprint automatically.
 * 
 * Example: POST /api/products
 * Body: { "name": "Summer Dress", "material": "cotton", "country": "India", "price": 1299 }
 */
router.post('/', createProduct);

module.exports = router;
