/**
 * Product Controller
 * ==================
 * 
 * This controller handles all product-related business logic including:
 * - Getting all products with carbon footprint data
 * - Getting a single product by ID
 * - Creating new products
 * - Updating carbon footprint calculations
 * - Filtering products by category and carbon impact
 * 
 * The carbon footprint is calculated by the AI service and stored in the database.
 * 
 * Author: GreenKart Team
 * Version: 1.0.0
 * For: Final Year Project Evaluation
 */

const axios = require('axios');

// AI Service URL for carbon footprint calculations
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// In-memory product data (will be replaced with MongoDB later)
// This simulates a database for demonstration purposes
let products = require('../data/products');

/**
 * Get All Products
 * ================
 * Retrieves all products with their carbon footprint data.
 * Supports filtering by category and carbon impact level.
 * 
 * Query Parameters:
 * - category: Filter by product category (e.g., "Shirts", "Jeans")
 * - impactLevel: Filter by carbon impact ("Low", "Medium", "High")
 * - sortBy: Sort field (e.g., "price", "ecoScore", "carbonFootprint")
 * - order: Sort order ("asc" or "desc")
 * - page: Page number for pagination (default: 1)
 * - limit: Products per page (default: 12)
 * 
 * @route GET /api/products
 * @access Public
 */
const getAllProducts = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const {
      category,
      impactLevel,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 12,
      search,
      minPrice,
      maxPrice,
      ecoFriendly
    } = req.query;

    // Start with all products
    let filteredProducts = [...products];

    // =========================================================================
    // FILTERING
    // =========================================================================

    // Filter by category
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by carbon impact level
    if (impactLevel) {
      filteredProducts = filteredProducts.filter(
        p => p.carbonImpactLevel === impactLevel
      );
    }

    // Filter by search term (name or description)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p => p.name.toLowerCase().includes(searchLower) ||
             p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        p => p.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        p => p.price <= parseFloat(maxPrice)
      );
    }

    // Filter eco-friendly only
    if (ecoFriendly === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isEcoFriendly);
    }

    // =========================================================================
    // SORTING
    // =========================================================================

    const sortMultiplier = order === 'desc' ? -1 : 1;
    
    filteredProducts.sort((a, b) => {
      let compareA, compareB;
      
      switch (sortBy) {
        case 'price':
          compareA = a.price;
          compareB = b.price;
          break;
        case 'ecoScore':
          compareA = a.ecoScore;
          compareB = b.ecoScore;
          break;
        case 'carbonFootprint':
          compareA = a.totalCarbonFootprint;
          compareB = b.totalCarbonFootprint;
          break;
        case 'name':
        default:
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          return sortMultiplier * compareA.localeCompare(compareB);
      }
      
      return sortMultiplier * (compareA - compareB);
    });

    // =========================================================================
    // PAGINATION
    // =========================================================================

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // =========================================================================
    // RESPONSE
    // =========================================================================

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredProducts.length / limitNum),
          totalProducts: filteredProducts.length,
          productsPerPage: limitNum,
          hasNextPage: endIndex < filteredProducts.length,
          hasPrevPage: pageNum > 1,
        },
        filters: {
          category: category || 'All',
          impactLevel: impactLevel || 'All',
          sortBy,
          order,
        },
      },
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};

/**
 * Get Single Product by ID
 * ========================
 * Retrieves a single product with complete carbon footprint details.
 * 
 * @route GET /api/products/:id
 * @access Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product by ID
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get similar products (same category, different ID)
    const similarProducts = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: {
        product,
        similarProducts,
        carbonBreakdown: {
          material: {
            type: product.materialType,
            impact: product.materialImpact,
            percentage: Math.round((product.materialImpact / product.totalCarbonFootprint) * 100) || 0,
          },
          transport: {
            mode: product.transportMode,
            distance: product.distanceKm,
            impact: product.transportImpact,
            percentage: Math.round((product.transportImpact / product.totalCarbonFootprint) * 100) || 0,
          },
          packaging: {
            type: product.packagingType,
            impact: product.packagingImpact,
            percentage: Math.round((product.packagingImpact / product.totalCarbonFootprint) * 100) || 0,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
};

/**
 * Calculate Carbon Footprint for a Product
 * =========================================
 * Calls the AI service to calculate carbon footprint based on product attributes.
 * 
 * @route POST /api/products/:id/calculate-carbon
 * @access Public
 */
const calculateCarbonFootprint = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = products[productIndex];

    // Call AI service for carbon calculation
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/carbon/calculate`, {
        material_type: product.materialType,
        weight_kg: product.productWeightKg,
        distance_km: product.distanceKm,
        transport_mode: product.transportMode,
        packaging_type: product.packagingType,
      });

      const carbonData = aiResponse.data;

      // Update product with calculated values
      products[productIndex] = {
        ...product,
        totalCarbonFootprint: carbonData.total_carbon_footprint,
        materialImpact: carbonData.material_impact,
        transportImpact: carbonData.transport_impact,
        packagingImpact: carbonData.packaging_impact,
        carbonImpactLevel: carbonData.carbon_impact_level,
        ecoScore: carbonData.eco_score,
        recommendations: carbonData.recommendations,
        isEcoFriendly: carbonData.carbon_impact_level === 'Low',
      };

      res.status(200).json({
        success: true,
        message: 'Carbon footprint calculated successfully',
        data: products[productIndex],
      });
    } catch (aiError) {
      // If AI service is unavailable, use fallback calculation
      console.warn('AI service unavailable, using fallback calculation');
      
      const fallbackFootprint = calculateFallbackFootprint(product);
      
      products[productIndex] = {
        ...product,
        ...fallbackFootprint,
      };

      res.status(200).json({
        success: true,
        message: 'Carbon footprint calculated using fallback method',
        data: products[productIndex],
        note: 'AI service unavailable, used simplified calculation',
      });
    }
  } catch (error) {
    console.error('Error calculating carbon footprint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate carbon footprint',
      error: error.message,
    });
  }
};

/**
 * Fallback Carbon Footprint Calculation
 * =====================================
 * Simple calculation used when AI service is unavailable.
 * 
 * This is a simplified version of the AI calculation for demonstration.
 * 
 * @param {Object} product - Product object
 * @returns {Object} - Carbon footprint data
 */
const calculateFallbackFootprint = (product) => {
  // Material emission factors (simplified)
  const materialFactors = {
    'polyester': 5.5,
    'nylon': 6.0,
    'cotton': 2.1,
    'organic_cotton': 1.2,
    'recycled_polyester': 1.8,
    'recycled_cotton': 1.0,
    'bamboo': 0.8,
    'hemp': 0.7,
    'wool': 2.5,
    'denim': 2.3,
    'leather': 3.5,
  };

  // Transport emission factors
  const transportFactors = {
    'air': 0.001095,
    'road': 0.000105,
    'rail': 0.000028,
    'sea': 0.000016,
  };

  // Packaging emission factors
  const packagingFactors = {
    'plastic': 0.45,
    'paper': 0.25,
    'recycled': 0.10,
    'cardboard': 0.20,
    'biodegradable': 0.15,
  };

  // Get factors with defaults
  const materialFactor = materialFactors[product.materialType.toLowerCase()] || 3.0;
  const transportFactor = transportFactors[product.transportMode] || 0.000105;
  const packagingFactor = packagingFactors[product.packagingType] || 0.45;

  // Calculate impacts
  const materialImpact = parseFloat((materialFactor * product.productWeightKg).toFixed(2));
  const transportImpact = parseFloat((transportFactor * product.productWeightKg * product.distanceKm).toFixed(2));
  const packagingImpact = packagingFactor;
  const totalCarbonFootprint = parseFloat((materialImpact + transportImpact + packagingImpact).toFixed(2));

  // Determine impact level
  let carbonImpactLevel;
  if (totalCarbonFootprint <= 2.0) {
    carbonImpactLevel = 'Low';
  } else if (totalCarbonFootprint <= 5.0) {
    carbonImpactLevel = 'Medium';
  } else {
    carbonImpactLevel = 'High';
  }

  // Calculate eco score (0-100)
  const ecoScore = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-2.5 * (totalCarbonFootprint / 10)))));

  return {
    totalCarbonFootprint,
    materialImpact,
    transportImpact,
    packagingImpact,
    carbonImpactLevel,
    ecoScore,
    isEcoFriendly: carbonImpactLevel === 'Low',
    recommendations: generateRecommendations(product, carbonImpactLevel),
  };
};

/**
 * Generate Recommendations
 * ========================
 * Creates suggestions to reduce carbon footprint.
 */
const generateRecommendations = (product, impactLevel) => {
  const recommendations = [];

  if (['polyester', 'nylon', 'acrylic'].includes(product.materialType.toLowerCase())) {
    recommendations.push('Consider switching to recycled or organic materials to reduce material impact by up to 70%');
  }

  if (product.transportMode === 'air') {
    recommendations.push('Switching from air to rail transport could reduce transport emissions by 97%');
  } else if (product.transportMode === 'road') {
    recommendations.push('Rail transport produces 73% less emissions than road transport');
  }

  if (product.packagingType === 'plastic') {
    recommendations.push('Using recycled packaging instead of plastic reduces packaging emissions by 78%');
  }

  if (impactLevel === 'Low') {
    recommendations.push('Great choice! This product uses sustainable practices');
  }

  return recommendations;
};

/**
 * Get Products by Carbon Impact Level
 * ====================================
 * Returns products filtered by their environmental impact.
 * 
 * @route GET /api/products/impact/:level
 * @access Public
 */
const getProductsByImpact = async (req, res) => {
  try {
    const { level } = req.params;
    
    if (!['Low', 'Medium', 'High'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid impact level. Use: Low, Medium, or High',
      });
    }

    const filteredProducts = products.filter(p => p.carbonImpactLevel === level);

    res.status(200).json({
      success: true,
      message: `Products with ${level} carbon impact retrieved`,
      data: {
        impactLevel: level,
        count: filteredProducts.length,
        products: filteredProducts,
      },
    });
  } catch (error) {
    console.error('Error getting products by impact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};

/**
 * Get Carbon Statistics
 * =====================
 * Returns aggregate statistics about product carbon footprints.
 * 
 * @route GET /api/products/stats/carbon
 * @access Public
 */
const getCarbonStats = async (req, res) => {
  try {
    const stats = {
      totalProducts: products.length,
      byImpactLevel: {
        Low: products.filter(p => p.carbonImpactLevel === 'Low').length,
        Medium: products.filter(p => p.carbonImpactLevel === 'Medium').length,
        High: products.filter(p => p.carbonImpactLevel === 'High').length,
      },
      averageFootprint: parseFloat(
        (products.reduce((sum, p) => sum + p.totalCarbonFootprint, 0) / products.length).toFixed(2)
      ),
      averageEcoScore: Math.round(
        products.reduce((sum, p) => sum + p.ecoScore, 0) / products.length
      ),
      ecoFriendlyCount: products.filter(p => p.isEcoFriendly).length,
      byCategory: {},
      byMaterial: {},
      byTransport: {},
    };

    // Calculate stats by category
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
      const catProducts = products.filter(p => p.category === cat);
      stats.byCategory[cat] = {
        count: catProducts.length,
        avgFootprint: parseFloat(
          (catProducts.reduce((sum, p) => sum + p.totalCarbonFootprint, 0) / catProducts.length).toFixed(2)
        ),
        avgEcoScore: Math.round(
          catProducts.reduce((sum, p) => sum + p.ecoScore, 0) / catProducts.length
        ),
      };
    });

    res.status(200).json({
      success: true,
      message: 'Carbon statistics retrieved',
      data: stats,
    });
  } catch (error) {
    console.error('Error getting carbon stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message,
    });
  }
};

/**
 * Get Categories
 * ==============
 * Returns all available product categories.
 * 
 * @route GET /api/products/categories
 * @access Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = [...new Set(products.map(p => p.category))];
    
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
};

/**
 * Get Similar Products
 * ====================
 * Returns similar products based on category.
 * 
 * @route GET /api/products/:id/similar
 * @access Public
 */
const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;
    
    // Find the current product
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get similar products (same category, different ID)
    const similarProducts = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: similarProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve similar products',
      error: error.message,
    });
  }
};

/**
 * Create New Product with AI-Predicted Carbon Footprint
 * ======================================================
 * Creates a new product and uses the AI model to predict its carbon footprint.
 * 
 * Required fields:
 * - name: Product name (e.g., "T-Shirt")
 * - material: Material type (cotton, polyester, recycled)
 * - country: Country of origin
 * - weight: Product weight in kg
 * - category: Product category
 * - price: Product price
 * - image: Product image URL
 * 
 * Optional fields:
 * - color, size, description, transport_distance, waste_percent
 * 
 * @route POST /api/products
 * @access Admin
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      material,
      country,
      weight = 0.5,
      category = 'Topwear',
      price = 999,
      image = '/images/placeholder.jpg',
      color = 'Black',
      size = 'M',
      description,
      transport_distance = 1000,
      waste_percent = 10,
    } = req.body;

    // Validate required fields
    if (!name || !material || !country) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, material, country',
      });
    }

    // Call AI service to predict carbon footprint
    let aiPrediction = null;
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'https://greenkart-ai.onrender.com';
    
    try {
      const aiResponse = await axios.post(`${aiServiceUrl}/api/predict/eco-score`, {
        material: material.toLowerCase(),
        weight: parseFloat(weight),
        transport_distance: parseFloat(transport_distance),
        waste_percent: parseFloat(waste_percent),
        country: country,
      }, { timeout: 10000 });
      
      aiPrediction = aiResponse.data;
      console.log('✅ AI Prediction received:', aiPrediction);
    } catch (aiError) {
      console.log('⚠️ AI service unavailable, using fallback calculation');
      // Fallback calculation
      const materialFactors = { cotton: 2.1, polyester: 5.5, recycled: 1.0 };
      const materialFactor = materialFactors[material.toLowerCase()] || 3.0;
      const carbonFootprint = parseFloat((materialFactor * weight + 0.25).toFixed(2));
      
      aiPrediction = {
        carbon_footprint: carbonFootprint,
        eco_score: Math.max(0, Math.min(100, Math.round(80 - carbonFootprint * 5))),
        impact_level: carbonFootprint < 5 ? 'Low' : carbonFootprint < 15 ? 'Medium' : 'High',
        sustainability_grade: carbonFootprint < 5 ? 'A' : carbonFootprint < 10 ? 'B' : 'C',
        recommendations: ['AI service unavailable - using fallback calculation'],
      };
    }

    // Determine impact level based on AI prediction
    const carbonImpactLevel = aiPrediction.impact_level || 
      (aiPrediction.carbon_footprint < 5 ? 'Low' : aiPrediction.carbon_footprint < 15 ? 'Medium' : 'High');

    // Generate new product ID
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const productId = `P${1500 + newId}`;

    // Create new product object
    const newProduct = {
      id: newId,
      productId: productId,
      name: name,
      displayName: `${name} - ${color} ${material.charAt(0).toUpperCase() + material.slice(1)}`,
      category: category,
      price: parseFloat(price),
      originalPrice: null,
      description: description || `Sustainable ${name.toLowerCase()} made with eco-friendly ${material}. Origin: ${country}.`,
      image: image,
      images: [image],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      selectedSize: size,
      color: color,
      colors: [color],
      brand: 'GreenKart Eco',
      inStock: true,
      rating: 4.0,
      reviews: 0,
      materialType: material.toLowerCase(),
      material: material.toLowerCase(),
      productWeightKg: parseFloat(weight),
      distanceKm: parseFloat(transport_distance),
      transportMode: 'road',
      packagingType: waste_percent <= 10 ? 'recycled' : 'paper',
      materialImpact: parseFloat((aiPrediction.carbon_footprint * 0.6).toFixed(2)),
      transportImpact: parseFloat((aiPrediction.carbon_footprint * 0.3).toFixed(2)),
      packagingImpact: parseFloat((aiPrediction.carbon_footprint * 0.1).toFixed(2)),
      totalCarbonFootprint: aiPrediction.carbon_footprint,
      carbonFootprint: aiPrediction.carbon_footprint,
      carbonImpactLevel: carbonImpactLevel,
      ecoScore: aiPrediction.eco_score,
      wastePercent: parseFloat(waste_percent),
      countryOfOrigin: country,
      country: country,
      cValue: aiPrediction.carbon_footprint,
      sustainabilityGrade: aiPrediction.sustainability_grade,
      aiPredicted: true,
      sustainabilityFeatures: [
        material.toLowerCase() === 'recycled' ? 'Made from recycled materials' : `Made with sustainable ${material}`,
        carbonImpactLevel === 'Low' ? 'Low carbon footprint' : 'Reduced carbon emissions',
        'AI-calculated sustainability score',
      ],
      tags: [
        name.toLowerCase(),
        color.toLowerCase(),
        material.toLowerCase(),
        category.toLowerCase(),
        country.toLowerCase(),
        'sustainable',
        'eco-friendly',
        'ai-predicted',
      ],
      createdAt: new Date().toISOString(),
    };

    // Add to products array (in production, this would save to database)
    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created with AI-predicted carbon footprint',
      data: newProduct,
      aiPrediction: {
        eco_score: aiPrediction.eco_score,
        carbon_footprint: aiPrediction.carbon_footprint,
        impact_level: aiPrediction.impact_level,
        sustainability_grade: aiPrediction.sustainability_grade,
        recommendations: aiPrediction.recommendations,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  calculateCarbonFootprint,
  getProductsByImpact,
  getCarbonStats,
  getCategories,
  getSimilarProducts,
  createProduct,
};
