/**
 * Carbon Savings Widget
 * Floating widget that shows user's carbon savings
 * Displays a modal with detailed breakdown when clicked
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CarbonSavingsWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  // Get user-specific storage key - consistent with Checkout.jsx
  const getUserStorageKey = () => {
    const userId = user?.id || user?.uid || user?.email;
    if (userId) {
      return `purchaseHistory_${userId}`;
    }
    return null;
  };

  // Load purchase history from localStorage (user-specific)
  useEffect(() => {
    const storageKey = getUserStorageKey();
    if (storageKey) {
      try {
        const savedPurchases = localStorage.getItem(storageKey);
        if (savedPurchases) {
          const parsed = JSON.parse(savedPurchases);
          setPurchaseHistory(Array.isArray(parsed) ? parsed : []);
        } else {
          setPurchaseHistory([]);
        }
      } catch (e) {
        console.error('Error loading purchase history:', e);
        setPurchaseHistory([]);
      }
    } else {
      setPurchaseHistory([]);
    }
  }, [user, isAuthenticated]);

  // Calculate total carbon saved
  useEffect(() => {
    // Average carbon footprint for non-eco products is ~8 kg CO2
    const avgNonEcoCarbon = 8;
    
    // Calculate savings from purchase history only
    let totalSaved = 0;
    purchaseHistory.forEach(item => {
      const ecoCarbon = item.totalCarbonFootprint || 2;
      totalSaved += (avgNonEcoCarbon - ecoCarbon) * (item.quantity || 1);
    });

    setCarbonSaved(parseFloat(totalSaved.toFixed(1)));
  }, [purchaseHistory]);

  // Calculate environmental equivalents
  const treesPlanted = Math.floor(carbonSaved / 21); // ~21 kg CO2 per tree per year
  const kmNotDriven = Math.round(carbonSaved / 0.25); // ~0.25 kg CO2 per km
  const deviceHours = Math.round(carbonSaved / 0.025); // ~0.025 kg CO2 per hour

  // Don't show if not authenticated or no savings yet
  if (!isAuthenticated || carbonSaved <= 0) {
    return null;
  }

  return (
    <>
      {/* Floating Widget */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="View carbon savings"
      >
        <div className="relative">
          {/* Animated ring */}
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
          
          {/* Main circle */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-xl flex flex-col items-center justify-center text-white border-4 border-white transform transition-transform group-hover:scale-110">
            <span className="text-xs font-medium opacity-90">You Saved</span>
            <span className="text-xl font-bold">{carbonSaved}</span>
            <span className="text-[10px] opacity-80">kg CO₂e</span>
          </div>
          
          {/* Leaf icon */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-green-600 text-sm">🌿</span>
          </div>
        </div>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                Your Carbon Footprint Impact
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Main savings circle */}
              <div className="flex justify-center mb-8">
                <div className="w-40 h-40 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl">
                  <span className="text-lg font-medium opacity-90">You Saved</span>
                  <span className="text-5xl font-bold">{carbonSaved}</span>
                  <span className="text-sm opacity-80">kg CO₂e</span>
                </div>
              </div>

              {/* Environmental equivalents */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Environmental Impact Equivalent To:
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🌲</div>
                    <p className="text-2xl font-bold text-green-700">{treesPlanted}</p>
                    <p className="text-xs text-gray-600">Trees planted for one year</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🚗</div>
                    <p className="text-2xl font-bold text-blue-700">{kmNotDriven}</p>
                    <p className="text-xs text-gray-600">Kilometers not driven</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">📱</div>
                    <p className="text-2xl font-bold text-purple-700">{deviceHours}</p>
                    <p className="text-xs text-gray-600">Hours of device usage</p>
                  </div>
                </div>
              </div>

              {/* How we calculate */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  How we calculate carbon footprint:
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our carbon footprint calculations use the Eco-Index LCA Model which accounts for 
                  materials, manufacturing processes, transportation, and end-of-life disposal. 
                  Lower scores indicate more eco-friendly products.
                </p>
              </div>

              {/* Recent eco purchases */}
              {purchaseHistory.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    🛍️ Your Eco-Friendly Purchases
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {purchaseHistory.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                          -{(8 - (item.totalCarbonFootprint || 2)).toFixed(1)} kg
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                <p className="text-green-800 font-medium mb-2">
                  🌟 Keep shopping eco-friendly to increase your impact!
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarbonSavingsWidget;
