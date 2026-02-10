"""
GreenKart AI Service - Carbon Footprint Calculator
===================================================

This FastAPI application provides AI/ML services for the GreenKart
e-commerce platform, including:

1. Carbon Footprint Calculation - Calculate environmental impact of products
2. Eco Score Rating - Sustainability score from 0-100
3. AI Recommendations - Suggestions to reduce carbon footprint

The carbon footprint calculator uses a weighted scoring model based on:
- Material type (polyester, cotton, recycled, etc.)
- Product weight (in kilograms)
- Distance traveled (manufacturing to warehouse)
- Transport mode (air, road, rail, sea)
- Packaging type (plastic, paper, recycled)

Author: GreenKart Team
Version: 2.0.0
For: Final Year Project Evaluation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime
import os
import numpy as np

# Try to load TensorFlow/Keras for ML model
try:
    import tensorflow as tf
    from tensorflow import keras
    KERAS_AVAILABLE = True
    print("✅ TensorFlow/Keras loaded successfully")
except ImportError:
    KERAS_AVAILABLE = False
    print("⚠️ TensorFlow not available - using formula-based calculations")

# Import our custom carbon footprint calculator module
from carbon_calculator import (
    CarbonFootprintCalculator,
    calculate_carbon_footprint,
    MATERIAL_EMISSION_FACTORS,
    TRANSPORT_EMISSION_FACTORS,
    PACKAGING_EMISSION_FACTORS
)

# ==============================================================================
# LOAD KERAS MODEL
# ==============================================================================

MODEL_PATH = os.path.join(os.path.dirname(__file__), "cfp_model.keras")
cfp_model = None

def load_keras_model():
    """Load the Carbon Footprint Prediction Keras model."""
    global cfp_model
    if KERAS_AVAILABLE and os.path.exists(MODEL_PATH):
        try:
            cfp_model = keras.models.load_model(MODEL_PATH)
            print(f"✅ Loaded Keras model from {MODEL_PATH}")
            print(f"   Model input shape: {cfp_model.input_shape}")
            print(f"   Model output shape: {cfp_model.output_shape}")
            return True
        except Exception as e:
            print(f"❌ Error loading Keras model: {e}")
            cfp_model = None
            return False
    else:
        if not KERAS_AVAILABLE:
            print("⚠️ TensorFlow not installed - model not loaded")
        elif not os.path.exists(MODEL_PATH):
            print(f"⚠️ Model file not found at {MODEL_PATH}")
        return False

# Load model at startup
load_keras_model()

# ==============================================================================
# FASTAPI APPLICATION INITIALIZATION
# ==============================================================================

app = FastAPI(
    title="GreenKart AI Service",
    description="""
    ## AI-powered Carbon Footprint Calculator
    
    This service calculates the environmental impact of products
    to help consumers make sustainable shopping choices.
    
    ### Features:
    - **Carbon Footprint Calculation**: Calculate CO2 emissions for products
    - **Eco Score**: Get sustainability ratings (0-100 scale)
    - **Impact Classification**: Low, Medium, or High impact levels
    - **AI Recommendations**: Suggestions to reduce environmental impact
    
    ### Calculation Factors:
    1. Material Type - Different materials have different carbon costs
    2. Product Weight - Heavier products = more resources
    3. Distance Traveled - Longer distance = more fuel
    4. Transport Mode - Air > Road > Rail > Sea (emissions)
    5. Packaging Type - Plastic > Paper > Recycled (impact)
    """,
    version="2.0.0",
    docs_url="/docs",      # Swagger UI documentation
    redoc_url="/redoc"     # ReDoc documentation
)

# ==============================================================================
# CORS CONFIGURATION
# Allow requests from frontend applications on different ports
# ==============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite default port
        "http://localhost:5174",   # Vite alternate port
        "http://localhost:5175",   # Vite alternate port
        "http://localhost:3000",   # React/Next.js default
        "http://localhost:5001",   # Backend server
        "https://greenkart-gules.vercel.app",  # Production frontend
        "https://green-kart.onrender.com",     # Production backend
    ],
    allow_credentials=True,
    allow_methods=["*"],           # Allow all HTTP methods
    allow_headers=["*"],           # Allow all headers
)

# Create an instance of our carbon calculator
calculator = CarbonFootprintCalculator()


# ==============================================================================
# PYDANTIC MODELS FOR REQUEST/RESPONSE VALIDATION
# These ensure data is properly formatted and documented in API docs
# ==============================================================================

class CarbonFootprintRequest(BaseModel):
    """
    Request model for calculating carbon footprint of a single product.
    
    Attributes:
        material_type: The material used in the product
        weight_kg: Product weight in kilograms
        distance_km: Distance from manufacturing to warehouse (km)
        transport_mode: How the product is transported
        packaging_type: Type of packaging used
    """
    material_type: str = Field(
        ...,  # Required field
        description="Material used in the product (e.g., 'cotton', 'polyester', 'recycled_cotton')",
        example="cotton"
    )
    weight_kg: float = Field(
        ...,
        gt=0,  # Must be greater than 0
        description="Product weight in kilograms",
        example=0.5
    )
    distance_km: float = Field(
        ...,
        gt=0,
        description="Distance from manufacturing location to warehouse in kilometers",
        example=5000
    )
    transport_mode: Literal["air", "road", "rail", "sea"] = Field(
        ...,
        description="Mode of transport used for shipping the product",
        example="road"
    )
    packaging_type: Literal["plastic", "paper", "recycled", "cardboard", "biodegradable"] = Field(
        ...,
        description="Type of packaging used for the product",
        example="recycled"
    )


class CarbonFootprintResponse(BaseModel):
    """
    Response model containing detailed carbon footprint analysis.
    
    This includes:
    - Total carbon footprint in kg CO2
    - Breakdown by factor (material, transport, packaging)
    - Impact level classification
    - Eco-friendliness score
    - AI-generated recommendations
    """
    total_carbon_footprint: float = Field(
        ...,
        description="Total CO2 emissions in kilograms"
    )
    material_impact: float = Field(
        ...,
        description="CO2 emissions from material production (kg)"
    )
    transport_impact: float = Field(
        ...,
        description="CO2 emissions from transportation (kg)"
    )
    packaging_impact: float = Field(
        ...,
        description="CO2 emissions from packaging (kg)"
    )
    carbon_impact_level: Literal["Low", "Medium", "High"] = Field(
        ...,
        description="Classification of environmental impact"
    )
    eco_score: int = Field(
        ...,
        ge=0,  # Greater than or equal to 0
        le=100,  # Less than or equal to 100
        description="Eco-friendliness score (0-100, higher is better)"
    )
    recommendations: List[str] = Field(
        ...,
        description="AI-generated recommendations to reduce carbon footprint"
    )


class BatchProductRequest(BaseModel):
    """Single product in a batch calculation request."""
    id: int = Field(..., description="Unique product ID")
    material_type: str
    weight_kg: float = Field(gt=0)
    distance_km: float = Field(gt=0)
    transport_mode: Literal["air", "road", "rail", "sea"]
    packaging_type: Literal["plastic", "paper", "recycled", "cardboard", "biodegradable"]


class BatchCarbonRequest(BaseModel):
    """Request model for calculating carbon footprint of multiple products."""
    products: List[BatchProductRequest] = Field(
        ...,
        description="List of products to calculate carbon footprint for"
    )


# ==============================================================================
# API ENDPOINTS
# ==============================================================================

@app.get("/")
async def root():
    """
    Root endpoint - Returns API information and available endpoints.
    
    This endpoint provides a welcome message and lists all available
    API endpoints for easy discovery.
    
    Returns:
        dict: Service information and endpoint list
    """
    return {
        "service": "GreenKart AI Service",
        "version": "2.0.0",
        "description": "AI-powered Carbon Footprint Calculator for sustainable shopping",
        "status": "running",
        "endpoints": {
            "health": "GET /health - Health check",
            "docs": "GET /docs - API documentation (Swagger UI)",
            "carbon_calculate": "POST /api/carbon/calculate - Calculate single product footprint",
            "carbon_batch": "POST /api/carbon/batch - Calculate multiple products",
            "carbon_factors": "GET /api/carbon/factors - View emission factors",
            "carbon_compare": "GET /api/carbon/compare - Compare material options",
        }
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring service status.
    
    Used by:
    - Load balancers to check service availability
    - Container orchestration (Docker, Kubernetes)
    - Monitoring systems (Prometheus, Grafana)
    
    Returns:
        dict: Health status with timestamp
    """
    return {
        "status": "healthy",
        "message": "AI service running with Carbon Footprint Calculator",
        "timestamp": datetime.now().isoformat(),
        "service": "greenkart-ai",
        "version": "2.0.0",
        "features": ["carbon_calculator", "eco_score", "recommendations"],
        "keras_model": {
            "loaded": cfp_model is not None,
            "tensorflow_available": KERAS_AVAILABLE,
            "model_path": MODEL_PATH if cfp_model else None
        }
    }


@app.post("/api/carbon/calculate", response_model=CarbonFootprintResponse)
async def calculate_single_footprint(request: CarbonFootprintRequest):
    """
    Calculate carbon footprint for a single product.
    
    This is the main endpoint for carbon footprint calculation.
    It takes product details and returns a comprehensive analysis.
    
    ## How it works:
    1. Material Impact = Material Factor × Weight
    2. Transport Impact = Transport Factor × Weight × Distance
    3. Packaging Impact = Packaging Factor
    4. Total = Material + Transport + Packaging
    
    ## Impact Levels:
    - Low: ≤ 2.0 kg CO2
    - Medium: 2.0 - 5.0 kg CO2
    - High: > 5.0 kg CO2
    
    Args:
        request: Product details including material, weight, distance, etc.
        
    Returns:
        CarbonFootprintResponse: Detailed carbon footprint analysis
        
    Raises:
        HTTPException: If calculation fails
    """
    try:
        # Call the calculator with request data
        result = calculator.calculate(
            material_type=request.material_type,
            weight_kg=request.weight_kg,
            distance_km=request.distance_km,
            transport_mode=request.transport_mode,
            packaging_type=request.packaging_type
        )
        
        # Return formatted response
        return CarbonFootprintResponse(
            total_carbon_footprint=result.total_carbon_footprint,
            material_impact=result.material_impact,
            transport_impact=result.transport_impact,
            packaging_impact=result.packaging_impact,
            carbon_impact_level=result.carbon_impact_level,
            eco_score=result.eco_score,
            recommendations=result.recommendations
        )
    except Exception as e:
        # Log error and return HTTP 500
        raise HTTPException(
            status_code=500, 
            detail=f"Carbon calculation error: {str(e)}"
        )


@app.post("/api/carbon/batch")
async def calculate_batch_footprint(request: BatchCarbonRequest):
    """
    Calculate carbon footprint for multiple products at once.
    
    This endpoint is more efficient than calling the single endpoint
    multiple times when you need to process many products (e.g., 
    calculating footprint for all products in a category).
    
    Args:
        request: List of products with their details
        
    Returns:
        dict: Results for each product including carbon data
        
    Example Request:
        POST /api/carbon/batch
        {
            "products": [
                {"id": 1, "material_type": "cotton", "weight_kg": 0.5, 
                 "distance_km": 5000, "transport_mode": "road", "packaging_type": "recycled"},
                {"id": 2, "material_type": "polyester", "weight_kg": 0.3,
                 "distance_km": 8000, "transport_mode": "air", "packaging_type": "plastic"}
            ]
        }
    """
    try:
        # Convert Pydantic models to dictionaries for batch processing
        products_data = [p.model_dump() for p in request.products]
        
        # Calculate footprint for all products
        results = calculator.calculate_batch(products_data)
        
        return {
            "success": True,
            "count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Batch calculation error: {str(e)}"
        )


@app.get("/api/carbon/factors")
async def get_emission_factors():
    """
    Get all emission factors used in carbon calculations.
    
    This endpoint returns the scientific emission factors used
    to calculate carbon footprint. Useful for:
    - Understanding the calculation methodology
    - Frontend display of factor information
    - Educational purposes and transparency
    
    Returns:
        dict: All emission factors with units and descriptions
    """
    return {
        "materials": {
            "factors": MATERIAL_EMISSION_FACTORS,
            "unit": "kg CO2 per kg of material",
            "description": "Carbon emissions from material production and processing",
            "categories": {
                "high_impact": ["polyester", "nylon", "acrylic", "leather"],
                "medium_impact": ["cotton", "wool", "silk", "denim"],
                "low_impact": ["organic_cotton", "bamboo", "hemp", "recycled"]
            }
        },
        "transport": {
            "factors": TRANSPORT_EMISSION_FACTORS,
            "unit": "kg CO2 per kg per km",
            "description": "Carbon emissions from transportation",
            "ranking": "air > road > rail > sea (emissions)"
        },
        "packaging": {
            "factors": PACKAGING_EMISSION_FACTORS,
            "unit": "kg CO2 per package",
            "description": "Carbon emissions from packaging production and disposal",
            "ranking": "plastic > paper > cardboard > biodegradable > recycled"
        },
        "impact_thresholds": {
            "Low": "≤ 2.0 kg CO2 - Eco-friendly product",
            "Medium": "2.0 - 5.0 kg CO2 - Average impact",
            "High": "> 5.0 kg CO2 - Consider alternatives"
        }
    }


@app.get("/api/carbon/compare")
async def compare_options(
    material1: str = "polyester",
    material2: str = "organic_cotton",
    weight_kg: float = 0.5,
    distance_km: float = 5000
):
    """
    Compare carbon footprint between two material/transport choices.
    
    This endpoint helps users understand the environmental difference
    between conventional and eco-friendly options for the same product.
    
    Args:
        material1: First material (typically conventional)
        material2: Second material (typically eco-friendly)
        weight_kg: Product weight for both calculations
        distance_km: Transport distance for both calculations
        
    Returns:
        dict: Side-by-side comparison with savings calculation
        
    Example:
        GET /api/carbon/compare?material1=polyester&material2=organic_cotton&weight_kg=0.5
    """
    # Calculate for option 1 (conventional)
    result1 = calculator.calculate(
        material_type=material1,
        weight_kg=weight_kg,
        distance_km=distance_km,
        transport_mode="road",
        packaging_type="plastic"
    )
    
    # Calculate for option 2 (eco-friendly)
    result2 = calculator.calculate(
        material_type=material2,
        weight_kg=weight_kg,
        distance_km=distance_km,
        transport_mode="rail",
        packaging_type="recycled"
    )
    
    # Calculate CO2 savings
    savings = result1.total_carbon_footprint - result2.total_carbon_footprint
    savings_percent = (savings / result1.total_carbon_footprint * 100) if result1.total_carbon_footprint > 0 else 0
    
    return {
        "comparison": {
            "conventional_option": {
                "material": material1,
                "transport": "road",
                "packaging": "plastic",
                "total_footprint_kg": result1.total_carbon_footprint,
                "impact_level": result1.carbon_impact_level,
                "eco_score": result1.eco_score
            },
            "eco_friendly_option": {
                "material": material2,
                "transport": "rail",
                "packaging": "recycled",
                "total_footprint_kg": result2.total_carbon_footprint,
                "impact_level": result2.carbon_impact_level,
                "eco_score": result2.eco_score
            }
        },
        "savings": {
            "co2_saved_kg": round(savings, 2),
            "percent_reduction": round(savings_percent, 1),
            "eco_score_improvement": result2.eco_score - result1.eco_score
        },
        "recommendation": f"Choosing {material2} over {material1} saves {round(savings, 2)} kg CO2 ({round(savings_percent, 1)}% reduction)"
    }


@app.get("/api/recommendations")
async def get_recommendations():
    """
    Placeholder for AI product recommendations.
    Will suggest eco-friendly alternatives based on user preferences.
    """
    return {
        "message": "AI recommendations feature coming soon!",
        "status": "not_implemented",
        "sample_data": [
            {"product_id": 1, "name": "Bamboo Water Bottle", "eco_score": 92},
            {"product_id": 2, "name": "Organic Cotton Tote", "eco_score": 88},
        ]
    }


# ==============================================================================
# AI PREDICTION ENDPOINT - Uses Dataset for Sustainability Scoring
# ==============================================================================

class PredictEcoScoreRequest(BaseModel):
    """Request model for AI eco score prediction."""
    material: str = Field(..., description="Material type (cotton, polyester, recycled)")
    weight: float = Field(..., gt=0, description="Product weight in kg")
    transport_distance: float = Field(..., gt=0, description="Transport distance in km")
    waste_percent: float = Field(..., ge=0, le=100, description="Manufacturing waste percentage")
    country: Optional[str] = Field("India", description="Country of origin")


class PredictEcoScoreResponse(BaseModel):
    """Response model for AI eco score prediction."""
    eco_score: int = Field(..., ge=0, le=100, description="Predicted eco score (0-100)")
    carbon_footprint: float = Field(..., description="Estimated carbon footprint in kg CO2")
    impact_level: str = Field(..., description="Impact classification (Low/Medium/High)")
    material_score: int = Field(..., description="Material sustainability score")
    transport_score: int = Field(..., description="Transport efficiency score")
    waste_score: int = Field(..., description="Manufacturing waste score")
    recommendations: List[str] = Field(..., description="AI recommendations for improvement")
    sustainability_grade: str = Field(..., description="Overall grade (A, B, C, D, F)")


# Material emission factors from the dataset
MATERIAL_FACTORS_AI = {
    "recycled": 1.0,
    "organic_cotton": 1.2,
    "bamboo": 0.8,
    "hemp": 0.7,
    "cotton": 2.1,
    "linen": 1.5,
    "wool": 2.5,
    "polyester": 5.5,
    "nylon": 6.0,
    "synthetic": 5.5,
}

# Country to transport mode mapping
COUNTRY_TRANSPORT_AI = {
    'USA': {'mode': 'sea', 'factor': 0.000016},
    'Australia': {'mode': 'sea', 'factor': 0.000016},
    'India': {'mode': 'road', 'factor': 0.000105},
    'China': {'mode': 'sea', 'factor': 0.000016},
    'UK': {'mode': 'sea', 'factor': 0.000016},
    'Germany': {'mode': 'road', 'factor': 0.000105},
    'France': {'mode': 'road', 'factor': 0.000105},
    'Italy': {'mode': 'road', 'factor': 0.000105},
    'Brazil': {'mode': 'sea', 'factor': 0.000016},
    'Canada': {'mode': 'sea', 'factor': 0.000016},
}

# Material encoding for Keras model input
MATERIAL_ENCODING = {
    'cotton': 0,
    'polyester': 1,
    'recycled': 2,
    'organic cotton': 0,  # Map to cotton
    'wool': 1,  # Map to polyester (similar impact)
    'nylon': 1,  # Map to polyester
    'silk': 1,  # Map to polyester
}

# Country encoding for Keras model input
COUNTRY_ENCODING = {
    'india': 0, 'china': 1, 'usa': 2, 'uk': 3, 'germany': 4,
    'france': 5, 'italy': 6, 'brazil': 7, 'canada': 8, 'australia': 9,
    'united states': 2, 'united kingdom': 3,
}


def predict_with_keras_model(material: str, weight: float, distance: float, waste_percent: float, country: str):
    """
    Use the Keras model to predict carbon footprint.
    Returns (carbon_footprint, eco_score) or None if model not available.
    """
    global cfp_model
    if cfp_model is None:
        return None
    
    try:
        # Encode material
        material_encoded = MATERIAL_ENCODING.get(material.lower().strip(), 0)
        
        # Encode country
        country_encoded = COUNTRY_ENCODING.get(country.lower().strip(), 0)
        
        # Prepare input array - adjust based on your model's expected input
        # Common format: [material_encoded, weight, distance, waste_percent, country_encoded]
        input_data = np.array([[
            material_encoded,
            weight,
            distance,
            waste_percent,
            country_encoded
        ]], dtype=np.float32)
        
        # Get prediction from model
        prediction = cfp_model.predict(input_data, verbose=0)
        
        # Extract carbon footprint from prediction
        if isinstance(prediction, np.ndarray):
            carbon_footprint = float(prediction[0][0]) if prediction.shape[1] >= 1 else float(prediction[0])
            # If model outputs eco_score as second value
            eco_score = float(prediction[0][1]) if prediction.shape[1] >= 2 else None
        else:
            carbon_footprint = float(prediction)
            eco_score = None
        
        return {
            'carbon_footprint': round(max(0, carbon_footprint), 2),
            'eco_score': int(max(0, min(100, eco_score))) if eco_score else None,
            'model_used': True
        }
    except Exception as e:
        print(f"Keras prediction error: {e}")
        return None


def calculate_ai_eco_score(material: str, weight: float, distance: float, waste_percent: float, country: str):
    """
    AI Model for calculating eco score based on the sustainability dataset.
    
    Uses Keras model if available, otherwise falls back to weighted scoring algorithm:
    - Material Score (40%): Based on material emission factors
    - Transport Score (30%): Based on distance and transport mode
    - Waste Score (30%): Based on manufacturing waste percentage
    """
    # Try Keras model first
    keras_result = predict_with_keras_model(material, weight, distance, waste_percent, country)
    model_used = keras_result is not None
    
    # Normalize material name
    material_lower = material.lower().strip()
    
    # Get material factor
    material_factor = MATERIAL_FACTORS_AI.get(material_lower, 3.0)
    
    # Calculate material score (100 = best, 0 = worst)
    # Lower emission factor = higher score
    material_score = max(0, min(100, int(100 - (material_factor * 10))))
    
    # Get transport info
    transport_info = COUNTRY_TRANSPORT_AI.get(country, {'mode': 'road', 'factor': 0.000105})
    transport_factor = transport_info['factor']
    
    # Calculate transport score (lower distance = higher score)
    # Max score for distance < 500km, decreases as distance increases
    transport_score = max(0, min(100, int(100 - (distance / 25))))
    
    # Calculate waste score (lower waste = higher score)
    waste_score = max(0, min(100, int(100 - (waste_percent * 4))))
    
    # Calculate carbon footprint - USE KERAS MODEL IF AVAILABLE
    if keras_result and 'carbon_footprint' in keras_result:
        total_carbon = keras_result['carbon_footprint']
    else:
        material_impact = material_factor * weight
        transport_impact = transport_factor * weight * distance
        packaging_impact = 0.15 if waste_percent <= 10 else 0.25 if waste_percent <= 15 else 0.35
        total_carbon = round(material_impact + transport_impact + packaging_impact, 2)
    
    # Determine impact level
    if total_carbon <= 2.0:
        impact_level = "Low"
    elif total_carbon <= 5.0:
        impact_level = "Medium"
    else:
        impact_level = "High"
    
    # Calculate weighted eco score
    eco_score = int(
        material_score * 0.40 +
        transport_score * 0.30 +
        waste_score * 0.30
    )
    eco_score = max(0, min(100, eco_score))
    
    # Determine grade
    if eco_score >= 80:
        grade = "A"
    elif eco_score >= 65:
        grade = "B"
    elif eco_score >= 50:
        grade = "C"
    elif eco_score >= 35:
        grade = "D"
    else:
        grade = "F"
    
    # Generate AI recommendations
    recommendations = []
    if material_score < 60:
        recommendations.append(f"Consider using recycled or organic materials instead of {material}")
    if transport_score < 50:
        recommendations.append("Source from closer manufacturing locations to reduce transport emissions")
    if waste_score < 70:
        recommendations.append("Implement waste reduction strategies in manufacturing process")
    if eco_score < 50:
        recommendations.append("This product has high environmental impact - consider eco-friendly alternatives")
    if len(recommendations) == 0:
        recommendations.append("Great sustainability score! Keep up the eco-friendly practices")
    
    return {
        'eco_score': eco_score,
        'carbon_footprint': total_carbon,
        'impact_level': impact_level,
        'material_score': material_score,
        'transport_score': transport_score,
        'waste_score': waste_score,
        'recommendations': recommendations,
        'sustainability_grade': grade,
        'model_used': model_used,
        'prediction_method': 'keras_model' if model_used else 'formula_based',
    }


@app.post("/api/predict/eco-score", response_model=PredictEcoScoreResponse)
async def predict_eco_score(request: PredictEcoScoreRequest):
    """
    AI Prediction Endpoint - Predict sustainability eco score for a product.
    
    This endpoint uses machine learning concepts based on the sustainability dataset
    to predict the eco score for a product given its attributes.
    
    ## Scoring Algorithm:
    - **Material Score (40%)**: Based on material emission factors
    - **Transport Score (30%)**: Based on distance and transport efficiency
    - **Waste Score (30%)**: Based on manufacturing waste percentage
    
    ## Grades:
    - A: 80-100 (Excellent sustainability)
    - B: 65-79 (Good sustainability)
    - C: 50-64 (Average sustainability)
    - D: 35-49 (Below average)
    - F: 0-34 (Poor sustainability)
    
    Args:
        request: Product attributes for prediction
        
    Returns:
        PredictEcoScoreResponse: Predicted eco score and analysis
    """
    try:
        result = calculate_ai_eco_score(
            material=request.material,
            weight=request.weight,
            distance=request.transport_distance,
            waste_percent=request.waste_percent,
            country=request.country or "India"
        )
        
        return PredictEcoScoreResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/api/dataset/stats")
async def get_dataset_stats():
    """
    Get statistics about the sustainability dataset used for predictions.
    """
    return {
        "dataset_name": "product_with_sustainability.csv",
        "total_products": 500,
        "features": [
            "prod_id", "pname", "category", "colour", "size",
            "countryname", "c_value", "material", "weight",
            "transport_distance", "waste_percent"
        ],
        "materials": ["cotton", "polyester", "recycled"],
        "countries": ["USA", "Australia", "India", "China", "UK", "Germany", "France", "Italy", "Brazil", "Canada"],
        "categories": ["Topwear", "Bottomwear", "Outerwear", "Fullbody"],
        "model_info": {
            "algorithm": "Weighted Scoring Model",
            "weights": {
                "material_impact": 0.40,
                "transport_impact": 0.30,
                "waste_impact": 0.30
            },
            "version": "1.0.0"
        }
    }


# ==============================================================================
# ENTRY POINT - Run with: python app.py or uvicorn app:app --reload --port 8000
# ==============================================================================

if __name__ == "__main__":
    import uvicorn
    print("🌿 Starting GreenKart AI Service...")
    print("📚 API Documentation: http://localhost:8000/docs")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
