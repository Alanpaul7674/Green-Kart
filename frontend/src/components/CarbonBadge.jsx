/**
 * Carbon Footprint Badge Component
 * Displays eco score, carbon impact level, and visual indicators
 */

import { useState } from 'react';

// Get color based on carbon impact level
const getImpactColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'low':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        icon: '🌿',
        label: 'Eco-Friendly'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-300',
        icon: '🌱',
        label: 'Moderate Impact'
      };
    case 'high':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        icon: '⚠️',
        label: 'High Impact'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        icon: '📊',
        label: 'Unknown'
      };
  }
};

// Get eco score color
const getEcoScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
};

// Get eco score gradient
const getEcoScoreGradient = (score) => {
  if (score >= 80) return 'from-green-500 to-green-600';
  if (score >= 60) return 'from-yellow-500 to-yellow-600';
  if (score >= 40) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
};

/**
 * Compact badge for product cards
 */
export const CarbonBadgeCompact = ({ ecoScore, carbonImpactLevel }) => {
  const colors = getImpactColor(carbonImpactLevel);
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
      <span>{colors.icon}</span>
      <span>{ecoScore}</span>
    </div>
  );
};

/**
 * Full badge with carbon footprint details
 */
export const CarbonBadgeFull = ({ 
  totalCarbonFootprint, 
  ecoScore, 
  carbonImpactLevel,
  materialImpact,
  transportImpact,
  packagingImpact,
  recommendations 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const colors = getImpactColor(carbonImpactLevel);
  const scoreGradient = getEcoScoreGradient(ecoScore);
  
  // Calculate percentages for breakdown
  const total = (materialImpact || 0) + (transportImpact || 0) + (packagingImpact || 0);
  const materialPercent = total > 0 ? Math.round((materialImpact / total) * 100) : 0;
  const transportPercent = total > 0 ? Math.round((transportImpact / total) * 100) : 0;
  const packagingPercent = total > 0 ? Math.round((packagingImpact / total) * 100) : 0;
  
  return (
    <div className={`rounded-xl border-2 ${colors.border} overflow-hidden`}>
      {/* Header */}
      <div className={`${colors.bg} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{colors.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-600">Carbon Impact</p>
              <p className={`text-lg font-bold ${colors.text}`}>{colors.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold bg-gradient-to-r ${scoreGradient} bg-clip-text text-transparent`}>
              {ecoScore}
            </div>
            <p className="text-xs text-gray-500">Eco Score</p>
          </div>
        </div>
        
        {/* Carbon footprint value */}
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-800">
            {totalCarbonFootprint?.toFixed(2) || '0.00'}
          </span>
          <span className="text-sm text-gray-500">kg CO₂</span>
        </div>
      </div>
      
      {/* Toggle details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-2 bg-white hover:bg-gray-50 text-sm font-medium text-gray-600 flex items-center justify-center gap-2 transition-colors"
      >
        {showDetails ? 'Hide Details' : 'View Breakdown'}
        <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {/* Details panel */}
      {showDetails && (
        <div className="bg-white p-4 border-t border-gray-100">
          {/* Impact breakdown */}
          <div className="space-y-3 mb-4">
            <h4 className="text-sm font-semibold text-gray-700">Carbon Breakdown</h4>
            
            {/* Material Impact */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">🧵 Material</span>
                <span className="font-medium">{materialImpact?.toFixed(2) || '0.00'} kg ({materialPercent}%)</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${materialPercent}%` }}
                />
              </div>
            </div>
            
            {/* Transport Impact */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">🚚 Transport</span>
                <span className="font-medium">{transportImpact?.toFixed(2) || '0.00'} kg ({transportPercent}%)</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${transportPercent}%` }}
                />
              </div>
            </div>
            
            {/* Packaging Impact */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">📦 Packaging</span>
                <span className="font-medium">{packagingImpact?.toFixed(2) || '0.00'} kg ({packagingPercent}%)</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${packagingPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 Eco Tips</h4>
              <ul className="space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Mini badge for product listing hover
 */
export const CarbonBadgeMini = ({ ecoScore, carbonImpactLevel }) => {
  const colors = getImpactColor(carbonImpactLevel);
  
  return (
    <div className="flex items-center gap-1">
      <span className={`text-xs font-bold ${getEcoScoreColor(ecoScore)}`}>
        {ecoScore}
      </span>
      <span className="text-xs">{colors.icon}</span>
    </div>
  );
};

/**
 * Eco Score Ring - circular progress indicator
 */
export const EcoScoreRing = ({ score, size = 'md' }) => {
  const sizes = {
    sm: { ring: 40, stroke: 4, text: 'text-sm' },
    md: { ring: 60, stroke: 5, text: 'text-lg' },
    lg: { ring: 80, stroke: 6, text: 'text-2xl' }
  };
  
  const { ring, stroke, text } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((score || 0) / 100) * circumference;
  
  const getStrokeColor = (score) => {
    if (score >= 80) return '#22c55e'; // green-500
    if (score >= 60) return '#eab308'; // yellow-500
    if (score >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={ring} height={ring} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor(score)}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className={`absolute ${text} font-bold text-gray-700`}>
        {score || 0}
      </span>
    </div>
  );
};

export default CarbonBadgeFull;
