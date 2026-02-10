"""
Carbon Footprint Calculator Module
==================================

This module contains the AI/ML logic for calculating the carbon footprint
of products based on various factors like material, weight, distance,
transport mode, and packaging.

The calculation uses a weighted scoring model that considers:
1. Material Impact - Different materials have different environmental costs
2. Weight Factor - Heavier products require more resources to produce/transport
3. Distance Factor - Longer distances mean more fuel consumption
4. Transport Mode - Air transport emits more CO2 than road/rail
5. Packaging Impact - Plastic vs paper vs recycled packaging

Author: GreenKart Team
Version: 1.0.0
"""

from typing import Dict, Literal
from dataclasses import dataclass
import math


# ==============================================================================
# EMISSION FACTORS (kg CO2 equivalent)
# These values are based on industry research and simplified for demonstration
# ==============================================================================

# Material emission factors (kg CO2 per kg of material produced)
# Higher values = more carbon intensive to produce
MATERIAL_EMISSION_FACTORS: Dict[str, float] = {
    # Synthetic materials (high carbon footprint)
    "polyester": 5.5,        # Petroleum-based, energy-intensive
    "nylon": 6.0,            # Similar to polyester, slightly higher
    "acrylic": 5.0,          # Synthetic fiber
    "synthetic": 5.5,        # Generic synthetic
    
    # Natural materials (medium carbon footprint)
    "cotton": 2.1,           # Water and pesticide intensive
    "wool": 2.5,             # Animal agriculture emissions
    "linen": 1.5,            # Lower impact natural fiber
    "silk": 2.8,             # Resource intensive production
    "leather": 3.5,          # Animal agriculture + processing
    "denim": 2.3,            # Cotton-based with processing
    
    # Eco-friendly materials (low carbon footprint)
    "organic_cotton": 1.2,   # No pesticides, sustainable farming
    "recycled_polyester": 1.8,  # Reused material, less energy
    "recycled_cotton": 1.0,  # Reused cotton fibers
    "bamboo": 0.8,           # Fast-growing, sustainable
    "hemp": 0.7,             # Low water, no pesticides
    "recycled": 1.0,         # Generic recycled material
    
    # Default for unknown materials
    "unknown": 3.0,
}

# Transport mode emission factors (kg CO2 per kg per km)
# Based on average cargo transport emissions
TRANSPORT_EMISSION_FACTORS: Dict[str, float] = {
    "air": 0.001095,    # Highest emissions - airplanes
    "road": 0.000105,   # Medium emissions - trucks
    "rail": 0.000028,   # Lowest emissions - trains
    "sea": 0.000016,    # Very low but slow - ships
}

# Packaging emission factors (kg CO2 per unit)
# Considers production and disposal impact
PACKAGING_EMISSION_FACTORS: Dict[str, float] = {
    "plastic": 0.45,     # Non-biodegradable, petroleum-based
    "paper": 0.25,       # Biodegradable but tree-intensive
    "recycled": 0.10,    # Lowest impact - reused materials
    "cardboard": 0.20,   # Similar to paper
    "biodegradable": 0.15,  # Eco-friendly packaging
}

# Carbon impact level thresholds (in kg CO2)
# Used to classify products as Low/Medium/High impact
IMPACT_THRESHOLDS = {
    "low": 2.0,      # Less than 2 kg CO2 = Low impact
    "medium": 5.0,   # 2-5 kg CO2 = Medium impact
    # Above 5 kg CO2 = High impact
}


@dataclass
class CarbonFootprintInput:
    """
    Input data structure for carbon footprint calculation.
    
    Attributes:
        material_type: Type of material (e.g., 'cotton', 'polyester')
        weight_kg: Product weight in kilograms
        distance_km: Distance from manufacturing to warehouse in km
        transport_mode: Mode of transport ('air', 'road', 'rail', 'sea')
        packaging_type: Type of packaging ('plastic', 'paper', 'recycled')
    """
    material_type: str
    weight_kg: float
    distance_km: float
    transport_mode: Literal["air", "road", "rail", "sea"]
    packaging_type: Literal["plastic", "paper", "recycled", "cardboard", "biodegradable"]


@dataclass
class CarbonFootprintResult:
    """
    Result data structure containing detailed carbon footprint breakdown.
    
    Attributes:
        total_carbon_footprint: Total CO2 emissions in kg
        material_impact: CO2 from material production
        transport_impact: CO2 from transportation
        packaging_impact: CO2 from packaging
        carbon_impact_level: Classification (Low/Medium/High)
        eco_score: Score from 0-100 (higher = more eco-friendly)
        recommendations: List of suggestions to reduce footprint
    """
    total_carbon_footprint: float
    material_impact: float
    transport_impact: float
    packaging_impact: float
    carbon_impact_level: str
    eco_score: int
    recommendations: list


class CarbonFootprintCalculator:
    """
    AI-powered Carbon Footprint Calculator
    
    This class implements a weighted scoring model to calculate
    the environmental impact of products. It considers multiple
    factors and provides actionable recommendations.
    
    Usage:
        calculator = CarbonFootprintCalculator()
        result = calculator.calculate(
            material_type="cotton",
            weight_kg=0.5,
            distance_km=5000,
            transport_mode="road",
            packaging_type="recycled"
        )
    """
    
    def __init__(self):
        """Initialize the calculator with emission factors."""
        self.material_factors = MATERIAL_EMISSION_FACTORS
        self.transport_factors = TRANSPORT_EMISSION_FACTORS
        self.packaging_factors = PACKAGING_EMISSION_FACTORS
    
    def _get_material_factor(self, material: str) -> float:
        """
        Get emission factor for a material type.
        Returns default value if material not found.
        
        Args:
            material: Material type string
            
        Returns:
            Emission factor in kg CO2 per kg material
        """
        # Normalize material name (lowercase, replace spaces)
        material_normalized = material.lower().replace(" ", "_").replace("-", "_")
        
        # Check for exact match first
        if material_normalized in self.material_factors:
            return self.material_factors[material_normalized]
        
        # Check for partial matches (e.g., "recycled cotton" contains "recycled")
        for key in self.material_factors:
            if key in material_normalized or material_normalized in key:
                return self.material_factors[key]
        
        # Return default if no match
        return self.material_factors["unknown"]
    
    def _calculate_material_impact(self, material: str, weight_kg: float) -> float:
        """
        Calculate CO2 emissions from material production.
        
        Formula: Material Impact = Material Factor × Weight
        
        Args:
            material: Type of material
            weight_kg: Weight in kilograms
            
        Returns:
            CO2 emissions in kg
        """
        factor = self._get_material_factor(material)
        return round(factor * weight_kg, 4)
    
    def _calculate_transport_impact(
        self, 
        weight_kg: float, 
        distance_km: float, 
        transport_mode: str
    ) -> float:
        """
        Calculate CO2 emissions from transportation.
        
        Formula: Transport Impact = Transport Factor × Weight × Distance
        
        Args:
            weight_kg: Product weight in kg
            distance_km: Distance traveled in km
            transport_mode: Mode of transport
            
        Returns:
            CO2 emissions in kg
        """
        factor = self.transport_factors.get(transport_mode.lower(), self.transport_factors["road"])
        return round(factor * weight_kg * distance_km, 4)
    
    def _calculate_packaging_impact(self, packaging_type: str) -> float:
        """
        Calculate CO2 emissions from packaging.
        
        Args:
            packaging_type: Type of packaging used
            
        Returns:
            CO2 emissions in kg
        """
        return self.packaging_factors.get(
            packaging_type.lower(), 
            self.packaging_factors["plastic"]
        )
    
    def _determine_impact_level(self, total_footprint: float) -> str:
        """
        Classify the carbon footprint into impact levels.
        
        Args:
            total_footprint: Total CO2 in kg
            
        Returns:
            Impact level string: 'Low', 'Medium', or 'High'
        """
        if total_footprint <= IMPACT_THRESHOLDS["low"]:
            return "Low"
        elif total_footprint <= IMPACT_THRESHOLDS["medium"]:
            return "Medium"
        else:
            return "High"
    
    def _calculate_eco_score(self, total_footprint: float) -> int:
        """
        Calculate an eco-friendliness score (0-100).
        Higher score = more eco-friendly.
        
        Uses linear scaling based on carbon footprint:
        EcoScore = ((maxCFP - predictedCFP) / (maxCFP - minCFP)) × 100
        
        Where:
        - minCFP = 1.0 (lowest carbon footprint in dataset)
        - maxCFP = 20.0 (highest carbon footprint in dataset)
        
        Args:
            total_footprint: Total CO2 in kg (predictedCFP)
            
        Returns:
            Eco score from 0 to 100
        """
        # Min and max carbon footprint values from the dataset
        min_cfp = 1.0   # Minimum CFP in dataset (~1.1)
        max_cfp = 20.0  # Maximum CFP in dataset (~19.87)
        
        # Clamp the footprint to valid range
        clamped_footprint = max(min_cfp, min(max_cfp, total_footprint))
        
        # Apply the EcoScore formula: (maxCFP - predictedCFP) / (maxCFP - minCFP) × 100
        score = ((max_cfp - clamped_footprint) / (max_cfp - min_cfp)) * 100
        
        return max(0, min(100, int(round(score))))
    
    def _generate_recommendations(
        self, 
        material: str, 
        transport_mode: str, 
        packaging_type: str,
        material_impact: float,
        transport_impact: float
    ) -> list:
        """
        Generate personalized recommendations to reduce carbon footprint.
        
        Args:
            material: Current material type
            transport_mode: Current transport mode
            packaging_type: Current packaging type
            material_impact: CO2 from material
            transport_impact: CO2 from transport
            
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        # Material recommendations
        material_factor = self._get_material_factor(material)
        if material_factor > 3.0:
            recommendations.append(
                "Consider switching to recycled or organic materials to reduce material impact by up to 70%"
            )
        elif material_factor > 2.0:
            recommendations.append(
                "Using bamboo or hemp alternatives could lower material emissions by 50%"
            )
        
        # Transport recommendations
        if transport_mode.lower() == "air":
            recommendations.append(
                "Switching from air to rail transport could reduce transport emissions by 97%"
            )
        elif transport_mode.lower() == "road":
            recommendations.append(
                "Rail transport produces 73% less emissions than road transport"
            )
        
        # Packaging recommendations
        if packaging_type.lower() == "plastic":
            recommendations.append(
                "Using recycled packaging instead of plastic reduces packaging emissions by 78%"
            )
        elif packaging_type.lower() == "paper":
            recommendations.append(
                "Consider biodegradable or recycled packaging for lower environmental impact"
            )
        
        # If already eco-friendly
        if not recommendations:
            recommendations.append(
                "Great choice! This product uses sustainable practices"
            )
        
        return recommendations
    
    def calculate(
        self,
        material_type: str,
        weight_kg: float,
        distance_km: float,
        transport_mode: str,
        packaging_type: str
    ) -> CarbonFootprintResult:
        """
        Calculate the complete carbon footprint for a product.
        
        This is the main method that combines all factors to produce
        a comprehensive carbon footprint analysis.
        
        Args:
            material_type: Type of material used in the product
            weight_kg: Product weight in kilograms
            distance_km: Distance from manufacturing to warehouse (km)
            transport_mode: Mode of transport (air/road/rail/sea)
            packaging_type: Type of packaging used
            
        Returns:
            CarbonFootprintResult with detailed breakdown
            
        Example:
            >>> calculator = CarbonFootprintCalculator()
            >>> result = calculator.calculate(
            ...     material_type="organic_cotton",
            ...     weight_kg=0.3,
            ...     distance_km=2000,
            ...     transport_mode="rail",
            ...     packaging_type="recycled"
            ... )
            >>> print(f"Total: {result.total_carbon_footprint} kg CO2")
            Total: 0.42 kg CO2
        """
        # Calculate individual impacts
        material_impact = self._calculate_material_impact(material_type, weight_kg)
        transport_impact = self._calculate_transport_impact(weight_kg, distance_km, transport_mode)
        packaging_impact = self._calculate_packaging_impact(packaging_type)
        
        # Calculate total footprint
        total_footprint = round(material_impact + transport_impact + packaging_impact, 2)
        
        # Determine impact level and eco score
        impact_level = self._determine_impact_level(total_footprint)
        eco_score = self._calculate_eco_score(total_footprint)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            material_type,
            transport_mode,
            packaging_type,
            material_impact,
            transport_impact
        )
        
        return CarbonFootprintResult(
            total_carbon_footprint=total_footprint,
            material_impact=round(material_impact, 2),
            transport_impact=round(transport_impact, 2),
            packaging_impact=round(packaging_impact, 2),
            carbon_impact_level=impact_level,
            eco_score=eco_score,
            recommendations=recommendations
        )
    
    def calculate_batch(self, products: list) -> list:
        """
        Calculate carbon footprint for multiple products at once.
        
        Args:
            products: List of dictionaries with product data
            
        Returns:
            List of results with product_id and carbon data
        """
        results = []
        for product in products:
            result = self.calculate(
                material_type=product.get("material_type", "unknown"),
                weight_kg=product.get("weight_kg", 0.5),
                distance_km=product.get("distance_km", 1000),
                transport_mode=product.get("transport_mode", "road"),
                packaging_type=product.get("packaging_type", "plastic")
            )
            results.append({
                "product_id": product.get("id"),
                "total_carbon_footprint": result.total_carbon_footprint,
                "material_impact": result.material_impact,
                "transport_impact": result.transport_impact,
                "packaging_impact": result.packaging_impact,
                "carbon_impact_level": result.carbon_impact_level,
                "eco_score": result.eco_score,
                "recommendations": result.recommendations
            })
        return results


# Create a singleton instance for easy import
calculator = CarbonFootprintCalculator()


def calculate_carbon_footprint(
    material_type: str,
    weight_kg: float,
    distance_km: float,
    transport_mode: str,
    packaging_type: str
) -> dict:
    """
    Convenience function to calculate carbon footprint.
    
    This function wraps the CarbonFootprintCalculator class
    for easier use in API endpoints.
    
    Args:
        material_type: Type of material
        weight_kg: Weight in kg
        distance_km: Distance in km
        transport_mode: Transport mode
        packaging_type: Packaging type
        
    Returns:
        Dictionary with carbon footprint data
    """
    result = calculator.calculate(
        material_type=material_type,
        weight_kg=weight_kg,
        distance_km=distance_km,
        transport_mode=transport_mode,
        packaging_type=packaging_type
    )
    
    return {
        "total_carbon_footprint": result.total_carbon_footprint,
        "material_impact": result.material_impact,
        "transport_impact": result.transport_impact,
        "packaging_impact": result.packaging_impact,
        "carbon_impact_level": result.carbon_impact_level,
        "eco_score": result.eco_score,
        "recommendations": result.recommendations
    }
