/**
 * AI Service API
 * Frontend service for interacting with the GreenKart AI prediction model
 */

// AI Service base URL - defaults to local development
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Predict eco score for a product using AI model
 * @param {Object} productData - Product attributes
 * @param {string} productData.material - Material type (cotton, polyester, recycled)
 * @param {number} productData.weight - Product weight in kg
 * @param {number} productData.transport_distance - Transport distance in km
 * @param {number} productData.waste_percent - Manufacturing waste percentage
 * @param {string} productData.country - Country of origin
 * @returns {Promise<Object>} - Predicted eco score and analysis
 */
export const predictEcoScore = async (productData) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/predict/eco-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        material: productData.material || 'cotton',
        weight: productData.weight || 0.5,
        transport_distance: productData.transport_distance || 1000,
        waste_percent: productData.waste_percent || 10,
        country: productData.country || 'India',
      }),
    });

    if (!response.ok) {
      throw new Error(`AI prediction failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI prediction error:', error);
    // Return mock data if AI service is unavailable
    return {
      eco_score: calculateLocalEcoScore(productData),
      carbon_footprint: calculateLocalCarbonFootprint(productData),
      impact_level: 'Medium',
      material_score: 60,
      transport_score: 50,
      waste_score: 70,
      recommendations: ['AI service unavailable - using local calculation'],
      sustainability_grade: 'C',
    };
  }
};

/**
 * Calculate carbon footprint for a product
 * @param {Object} productData - Product details
 */
export const calculateCarbonFootprint = async (productData) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/carbon/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        material_type: productData.materialType || productData.material || 'cotton',
        weight_kg: productData.productWeightKg || productData.weight || 0.5,
        distance_km: productData.distanceKm || productData.transport_distance || 1000,
        transport_mode: productData.transportMode || 'road',
        packaging_type: productData.packagingType || 'recycled',
      }),
    });

    if (!response.ok) {
      throw new Error(`Carbon calculation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Carbon calculation error:', error);
    // Return local calculation if service unavailable
    return {
      total_carbon_footprint: calculateLocalCarbonFootprint(productData),
      material_impact: 1.0,
      transport_impact: 0.5,
      packaging_impact: 0.2,
      carbon_impact_level: 'Medium',
      eco_score: 65,
      recommendations: ['AI service unavailable'],
    };
  }
};

/**
 * Get dataset statistics
 */
export const getDatasetStats = async () => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/dataset/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch dataset stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Dataset stats error:', error);
    return null;
  }
};

/**
 * Check AI service health
 */
export const checkAIServiceHealth = async () => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`);
    if (!response.ok) {
      return { status: 'unhealthy' };
    }
    return await response.json();
  } catch (error) {
    return { status: 'unavailable', error: error.message };
  }
};

// ============================================================================
// LOCAL FALLBACK CALCULATIONS
// ============================================================================

const MATERIAL_FACTORS = {
  recycled: 1.0,
  organic_cotton: 1.2,
  bamboo: 0.8,
  hemp: 0.7,
  cotton: 2.1,
  linen: 1.5,
  wool: 2.5,
  polyester: 5.5,
  nylon: 6.0,
  synthetic: 5.5,
};

/**
 * Local eco score calculation (fallback when AI service unavailable)
 */
function calculateLocalEcoScore(productData) {
  const material = (productData.material || 'cotton').toLowerCase();
  const weight = productData.weight || 0.5;
  const distance = productData.transport_distance || 1000;
  const wastePercent = productData.waste_percent || 10;

  const materialFactor = MATERIAL_FACTORS[material] || 3.0;
  const materialScore = Math.max(0, Math.min(100, 100 - materialFactor * 10));
  const transportScore = Math.max(0, Math.min(100, 100 - distance / 25));
  const wasteScore = Math.max(0, Math.min(100, 100 - wastePercent * 4));

  return Math.round(materialScore * 0.4 + transportScore * 0.3 + wasteScore * 0.3);
}

/**
 * Local carbon footprint calculation (fallback)
 */
function calculateLocalCarbonFootprint(productData) {
  const material = (productData.material || 'cotton').toLowerCase();
  const weight = productData.weight || 0.5;
  const distance = productData.transport_distance || 1000;

  const materialFactor = MATERIAL_FACTORS[material] || 3.0;
  const transportFactor = 0.000105; // road transport default

  const materialImpact = materialFactor * weight;
  const transportImpact = transportFactor * weight * distance;
  const packagingImpact = 0.2;

  return Math.round((materialImpact + transportImpact + packagingImpact) * 100) / 100;
}

export default {
  predictEcoScore,
  calculateCarbonFootprint,
  getDatasetStats,
  checkAIServiceHealth,
};
