/**
 * Admin Add Product Page
 * ======================
 * Form to add new products with AI-predicted carbon footprint
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminAddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    material: 'cotton',
    country: 'India',
    weight: 0.5,
    price: 999,
    category: 'Topwear',
    color: 'Black',
    transport_distance: 500,
    waste_percent: 10,
    description: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const materials = ['cotton', 'polyester', 'recycled', 'wool', 'silk', 'linen'];
  const countries = ['India', 'China', 'USA', 'UK', 'Germany', 'France', 'Italy', 'Brazil', 'Canada', 'Australia'];
  const categories = ['Topwear', 'Bottomwear', 'Fullbody', 'Outerwear'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Brown', 'Grey', 'Navy'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/products', {
        ...formData,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price),
        transport_distance: parseFloat(formData.transport_distance),
        waste_percent: parseFloat(formData.waste_percent),
      });

      if (response.data.success) {
        setResult(response.data);
        // Reset form
        setFormData({
          name: '',
          material: 'cotton',
          country: 'India',
          weight: 0.5,
          price: 999,
          category: 'Topwear',
          color: 'Black',
          transport_distance: 500,
          waste_percent: 10,
          description: '',
          image: '',
        });
      } else {
        setError(response.data.message || 'Failed to create product');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-green-400';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/products" className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">
            Add a new product and let the AI model predict its carbon footprint and eco score
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📝 Product Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Summer T-Shirt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Material & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {materials.map(m => (
                      <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country of Origin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {colors.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0.1"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Transport Distance & Waste */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport Distance (km)</label>
                  <input
                    type="number"
                    name="transport_distance"
                    value={formData.transport_distance}
                    onChange={handleChange}
                    min="0"
                    max="20000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waste Percent (%)</label>
                  <input
                    type="number"
                    name="waste_percent"
                    value={formData.waste_percent}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/images/product.jpg or https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Product description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.name}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  loading || !formData.name
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    AI Predicting...
                  </span>
                ) : (
                  '🤖 Add Product with AI Prediction'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                ❌ {error}
              </div>
            )}
          </div>

          {/* AI Prediction Result */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  ✅ Product Created Successfully!
                </h2>

                {/* Product Preview */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">{result.data.displayName}</h3>
                  <p className="text-green-600 font-bold text-xl">₹{result.data.price?.toLocaleString()}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">{result.data.material}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{result.data.country}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">{result.data.category}</span>
                  </div>
                </div>

                {/* AI Prediction Box */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🤖 AI Model Prediction
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Carbon Footprint */}
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-500">Carbon Footprint</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {result.aiPrediction.carbon_footprint}
                        <span className="text-sm font-normal text-gray-500 ml-1">kg CO₂</span>
                      </p>
                    </div>

                    {/* Eco Score */}
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-500">Eco Score</p>
                      <p className="text-2xl font-bold text-green-600">
                        {result.aiPrediction.eco_score}
                        <span className="text-sm font-normal text-gray-500 ml-1">/ 100</span>
                      </p>
                    </div>

                    {/* Impact Level */}
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-500">Impact Level</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(result.aiPrediction.impact_level)}`}>
                        {result.aiPrediction.impact_level}
                      </span>
                    </div>

                    {/* Sustainability Grade */}
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-500">Grade</p>
                      <span className={`inline-block w-10 h-10 rounded-full text-white font-bold text-xl leading-10 ${getGradeColor(result.aiPrediction.sustainability_grade)}`}>
                        {result.aiPrediction.sustainability_grade}
                      </span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.aiPrediction.recommendations?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">💡 AI Recommendations:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {result.aiPrediction.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* View Product Link */}
                <Link
                  to={`/product/${result.data.id}`}
                  className="mt-4 block w-full py-3 text-center bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  View Product →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🤖 AI Carbon Prediction
                </h2>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-gray-500">
                    Fill in the product details and the AI model will automatically predict:
                  </p>
                  <ul className="mt-4 text-left text-gray-600 space-y-2 max-w-xs mx-auto">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Carbon Footprint (kg CO₂)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Eco Score (0-100)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Impact Level (Low/Medium/High)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Sustainability Grade (A-F)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> AI Recommendations
                    </li>
                  </ul>
                </div>

                {/* Model Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-2">📊 Model Info:</p>
                  <ul className="space-y-1">
                    <li>• Model: cfp_model.keras</li>
                    <li>• Trained on: 500 products dataset</li>
                    <li>• Features: material, weight, distance, waste</li>
                    <li>• Deployed on: Render.com</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
