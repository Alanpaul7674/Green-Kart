/**
 * Product Model with Carbon Footprint Support
 * ============================================
 * 
 * This model defines the structure for product documents in MongoDB.
 * It includes comprehensive carbon footprint data to support GreenKart's
 * sustainability features.
 * 
 * Carbon Footprint Calculation is based on:
 * 1. Material Type - Different materials have different environmental impacts
 * 2. Product Weight - Heavier products require more resources
 * 3. Distance Traveled - From manufacturing to warehouse
 * 4. Transport Mode - Air, road, rail, or sea shipping
 * 5. Packaging Type - Plastic, paper, or recycled materials
 * 
 * Author: GreenKart Team
 * Version: 2.0.0
 * For: Final Year Project Evaluation
 */

const mongoose = require('mongoose');

/**
 * Product Schema
 * ==============
 * Defines the complete structure for products including:
 * - Basic product information (name, price, category)
 * - Carbon footprint calculation inputs
 * - Calculated carbon footprint results
 */
const productSchema = new mongoose.Schema(
  {
    // =========================================================================
    // BASIC PRODUCT INFORMATION
    // Standard e-commerce product fields
    // =========================================================================
    
    /**
     * Product name - displayed on product cards and detail pages
     * Example: "Organic Cotton T-Shirt", "Recycled Denim Jeans"
     */
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    
    /**
     * Product description - detailed information about the product
     * Should include material composition and sustainability details
     */
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    
    /**
     * Product price in INR (Indian Rupees)
     * Must be a positive number
     */
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    
    /**
     * Product category for filtering and organization
     * Examples: Shirts, T-Shirts, Jeans, Dresses, Jackets, etc.
     */
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: ['Shirts', 'T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Hoodies', 
                 'Footwear', 'Accessories', 'Pants', 'Shorts', 'Activewear', 'Other'],
        message: '{VALUE} is not a valid category'
      },
    },
    
    /**
     * Product image URL
     * Can be a local path or external URL (e.g., Unsplash)
     */
    image: {
      type: String,
      default: 'no-image.png',
    },
    
    /**
     * Available stock quantity
     * Decreases when orders are placed
     */
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    
    /**
     * Available sizes for the product
     * Used for clothing items
     */
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    },
    
    /**
     * Flag indicating if the product is eco-friendly
     * Products with low carbon impact are marked as eco-friendly
     */
    isEcoFriendly: {
      type: Boolean,
      default: false,
    },

    // =========================================================================
    // CARBON FOOTPRINT INPUT FIELDS
    // These fields are used to calculate the carbon footprint
    // =========================================================================
    
    /**
     * Material Type
     * The primary material used in the product
     * 
     * High Impact Materials: polyester, nylon, acrylic, leather
     * Medium Impact Materials: cotton, wool, silk, denim
     * Low Impact Materials: organic_cotton, bamboo, hemp, recycled
     * 
     * Example: "organic_cotton", "recycled_polyester"
     */
    materialType: {
      type: String,
      required: [true, 'Material type is required for carbon calculation'],
      trim: true,
      lowercase: true,
    },
    
    /**
     * Product Weight in Kilograms
     * Used to calculate transport and material emissions
     * 
     * Typical ranges:
     * - T-Shirts: 0.15 - 0.25 kg
     * - Shirts: 0.2 - 0.35 kg
     * - Jeans: 0.5 - 0.8 kg
     * - Jackets: 0.5 - 1.5 kg
     * - Footwear: 0.3 - 1.0 kg
     */
    productWeightKg: {
      type: Number,
      required: [true, 'Product weight is required for carbon calculation'],
      min: [0.01, 'Weight must be at least 0.01 kg'],
      max: [50, 'Weight cannot exceed 50 kg'],
    },
    
    /**
     * Manufacturing Location
     * Where the product is manufactured
     * Used to determine transport distance
     * 
     * Examples: "China", "Bangladesh", "India", "Vietnam"
     */
    manufacturingLocation: {
      type: String,
      required: [true, 'Manufacturing location is required'],
      trim: true,
    },
    
    /**
     * Warehouse Location
     * Where the product is stored before shipping to customers
     * Combined with manufacturing location to calculate distance
     * 
     * Example: "Mumbai, India", "Delhi, India"
     */
    warehouseLocation: {
      type: String,
      default: 'Mumbai, India',
      trim: true,
    },
    
    /**
     * Distance from Manufacturing to Warehouse (in kilometers)
     * Pre-calculated based on manufacturing and warehouse locations
     * 
     * Typical ranges:
     * - Domestic: 500 - 2000 km
     * - International (Asia): 2000 - 5000 km
     * - International (Europe/US): 5000 - 15000 km
     */
    distanceKm: {
      type: Number,
      required: [true, 'Distance is required for carbon calculation'],
      min: [1, 'Distance must be at least 1 km'],
    },
    
    /**
     * Transport Mode
     * How the product is shipped from manufacturing to warehouse
     * 
     * Emission levels (highest to lowest):
     * - air: Fastest but highest emissions (0.001095 kg CO2/kg/km)
     * - road: Common for regional shipping (0.000105 kg CO2/kg/km)
     * - rail: Lower emissions than road (0.000028 kg CO2/kg/km)
     * - sea: Slowest but lowest emissions (0.000016 kg CO2/kg/km)
     */
    transportMode: {
      type: String,
      required: [true, 'Transport mode is required for carbon calculation'],
      enum: {
        values: ['air', 'road', 'rail', 'sea'],
        message: '{VALUE} is not a valid transport mode. Use: air, road, rail, or sea'
      },
      default: 'road',
    },
    
    /**
     * Packaging Type
     * Type of packaging used for the product
     * 
     * Emission levels (highest to lowest):
     * - plastic: Non-biodegradable (0.45 kg CO2/unit)
     * - paper: Biodegradable but tree-intensive (0.25 kg CO2/unit)
     * - cardboard: Similar to paper (0.20 kg CO2/unit)
     * - biodegradable: Eco-friendly option (0.15 kg CO2/unit)
     * - recycled: Lowest impact (0.10 kg CO2/unit)
     */
    packagingType: {
      type: String,
      required: [true, 'Packaging type is required for carbon calculation'],
      enum: {
        values: ['plastic', 'paper', 'recycled', 'cardboard', 'biodegradable'],
        message: '{VALUE} is not a valid packaging type'
      },
      default: 'recycled',
    },

    // =========================================================================
    // CARBON FOOTPRINT OUTPUT FIELDS
    // Calculated values from the AI service or stored for quick access
    // =========================================================================
    
    /**
     * Total Carbon Footprint (in kg CO2)
     * Sum of material, transport, and packaging emissions
     * Calculated using the formula:
     * Total = (Material Factor × Weight) + (Transport Factor × Weight × Distance) + Packaging Factor
     */
    totalCarbonFootprint: {
      type: Number,
      default: 0,
      min: [0, 'Carbon footprint cannot be negative'],
    },
    
    /**
     * Material Impact (in kg CO2)
     * CO2 emissions from material production
     * Formula: Material Factor × Product Weight
     */
    materialImpact: {
      type: Number,
      default: 0,
    },
    
    /**
     * Transport Impact (in kg CO2)
     * CO2 emissions from transportation
     * Formula: Transport Factor × Weight × Distance
     */
    transportImpact: {
      type: Number,
      default: 0,
    },
    
    /**
     * Packaging Impact (in kg CO2)
     * CO2 emissions from packaging production and disposal
     */
    packagingImpact: {
      type: Number,
      default: 0,
    },
    
    /**
     * Base Carbon Footprint (Fallback Value)
     * Used when AI calculation is not available
     * Can be manually set based on industry averages
     */
    baseCarbonFootprint: {
      type: Number,
      default: 2.5,  // Average value in kg CO2
    },
    
    /**
     * Carbon Impact Level Classification
     * Categorizes products based on their total carbon footprint
     * 
     * - Low: ≤ 2.0 kg CO2 (Eco-friendly, green badge)
     * - Medium: 2.0 - 5.0 kg CO2 (Average impact, yellow badge)
     * - High: > 5.0 kg CO2 (High impact, red badge)
     */
    carbonImpactLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    
    /**
     * Eco Score (0-100)
     * A sustainability rating where higher is better
     * Calculated using logarithmic decay based on carbon footprint
     */
    ecoScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    
    /**
     * AI Recommendations
     * Suggestions to reduce carbon footprint
     * Generated by the AI service
     */
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
    
    // Enable virtual fields in JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// =========================================================================
// VIRTUAL FIELDS
// Computed properties that don't exist in the database
// =========================================================================

/**
 * Virtual field: isLowCarbon
 * Returns true if the product has low carbon impact
 */
productSchema.virtual('isLowCarbon').get(function() {
  return this.carbonImpactLevel === 'Low';
});

/**
 * Virtual field: carbonBadgeColor
 * Returns the color for displaying carbon impact badge
 */
productSchema.virtual('carbonBadgeColor').get(function() {
  const colors = {
    'Low': 'green',
    'Medium': 'yellow',
    'High': 'red'
  };
  return colors[this.carbonImpactLevel] || 'gray';
});

// =========================================================================
// INDEXES
// Optimize database queries for common operations
// =========================================================================

// Index for category filtering
productSchema.index({ category: 1 });

// Index for carbon impact filtering
productSchema.index({ carbonImpactLevel: 1 });

// Index for eco-friendly products
productSchema.index({ isEcoFriendly: 1 });

// Compound index for sorting by eco score
productSchema.index({ ecoScore: -1, carbonImpactLevel: 1 });

// =========================================================================
// PRE-SAVE MIDDLEWARE
// Automatically set isEcoFriendly based on carbon impact
// =========================================================================

productSchema.pre('save', function(next) {
  // Set isEcoFriendly based on carbon impact level
  this.isEcoFriendly = this.carbonImpactLevel === 'Low';
  next();
});

// Create and export the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
