/**
 * Product Routes








































































































































































































































































































































































































































































































































































































































































































export default AdminDashboard;};  );    </div>      )}        </div>          </div>            </div>              <ProductForm onSubmit={handleUpdate} isEdit={true} />            <div className="p-6">            </div>              <p className="text-gray-500">Editing: {selectedProduct.name}</p>              <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Product</h2>            <div className="p-6 border-b sticky top-0 bg-white">          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">      {showEditModal && selectedProduct && (      {/* Edit Product Modal */}      )}        </div>          </div>            </div>              <ProductForm onSubmit={handleCreate} isEdit={false} />            <div className="p-6">            </div>              <p className="text-gray-500">AI will predict the carbon footprint automatically</p>              <h2 className="text-2xl font-bold text-gray-800">➕ Add New Product</h2>            <div className="p-6 border-b sticky top-0 bg-white">          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">      {showAddModal && (      {/* Add Product Modal */}      </div>        </div>          )}            </div>              )}                </div>                  Showing 50 of {filteredProducts.length} products. Use search to find more.                <div className="p-4 text-center text-gray-500 border-t">              {filteredProducts.length > 50 && (              </table>                </tbody>                  ))}                    </tr>                      </td>                        </div>                          </button>                            🗑️ Delete                          >                            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition text-sm"                            onClick={() => handleDelete(product.id, product.name)}                          <button                          </button>                            ✏️ Edit                          >                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition text-sm"                            onClick={() => openEditModal(product)}                          <button                        <div className="flex justify-center gap-2">                      <td className="px-4 py-4">                      </td>                        </div>                          <span className="text-sm text-gray-600">{product.ecoScore || 0}</span>                          </div>                            />                              style={{ width: `${product.ecoScore || 0}%` }}                              className="bg-green-500 h-2 rounded-full"                            <div                          <div className="w-16 bg-gray-200 rounded-full h-2">                        <div className="flex items-center gap-2">                      <td className="px-4 py-4">                      </td>                        </span>                          {product.carbonImpactLevel || 'N/A'}                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(product.carbonImpactLevel)}`}>                      <td className="px-4 py-4">                      </td>                        {(product.totalCarbonFootprint || product.carbonFootprint || 0).toFixed(2)} kg                      <td className="px-4 py-4 text-sm text-gray-600">                      <td className="px-4 py-4 text-sm font-medium text-gray-900">₹{product.price}</td>                      <td className="px-4 py-4 text-sm text-gray-600">{product.category}</td>                      </td>                        </div>                          </div>                            <p className="text-xs text-gray-500">{product.material || product.materialType}</p>                            <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>                          <div>                          />                            }}                              e.target.src = 'https://placehold.co/100x100?text=No+Image';                            onError={(e) => {                            className="w-12 h-12 object-cover rounded-lg"                            alt={product.name}                            src={product.image || '/images/placeholder.jpg'}                          <img                        <div className="flex items-center gap-3">                      <td className="px-4 py-4">                    <tr key={product.id} className="hover:bg-gray-50">                  {filteredProducts.slice(0, 50).map((product) => (                <tbody className="divide-y divide-gray-200">                </thead>                  </tr>                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eco Score</th>                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carbon</th>                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>                  <tr>                <thead className="bg-gray-50">              <table className="w-full">            <div className="overflow-x-auto">          ) : (            </div>              </button>                Add your first product              >                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"                onClick={() => setShowAddModal(true)}              <button              <p className="text-gray-500 text-lg">No products found</p>            <div className="p-12 text-center">          ) : filteredProducts.length === 0 ? (            </div>              <p className="mt-4 text-gray-500">Loading products...</p>              <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>            <div className="p-12 text-center">          {loading ? (        <div className="bg-white rounded-lg shadow overflow-hidden">      <div className="max-w-7xl mx-auto px-6 pb-12">      {/* Products Table */}      </div>        </div>          </button>            🔄 Refresh          >            className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"            onClick={fetchProducts}          <button          </div>            </select>              ))}                <option key={cat} value={cat}>{cat}</option>              {categories.map(cat => (              <option value="All">All Categories</option>            >              className="w-full md:w-auto p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"              onChange={(e) => setCategoryFilter(e.target.value)}              value={categoryFilter}            <select          <div>          </div>            />              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"              onChange={(e) => setSearchTerm(e.target.value)}              value={searchTerm}              placeholder="🔍 Search products..."              type="text"            <input          <div className="flex-1">        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">      <div className="max-w-7xl mx-auto px-6">      {/* Filters */}      </div>        </div>          </div>            <p className="text-gray-500">High Impact</p>            </p>              {products.filter(p => p.carbonImpactLevel === 'High').length}            <p className="text-3xl font-bold text-red-600">          <div className="bg-white p-4 rounded-lg shadow">          </div>            <p className="text-gray-500">Medium Impact</p>            </p>              {products.filter(p => p.carbonImpactLevel === 'Medium').length}            <p className="text-3xl font-bold text-yellow-600">          <div className="bg-white p-4 rounded-lg shadow">          </div>            <p className="text-gray-500">Low Impact</p>            </p>              {products.filter(p => p.carbonImpactLevel === 'Low').length}            <p className="text-3xl font-bold text-green-600">          <div className="bg-white p-4 rounded-lg shadow">          </div>            <p className="text-gray-500">Total Products</p>            <p className="text-3xl font-bold text-gray-800">{products.length}</p>          <div className="bg-white p-4 rounded-lg shadow">        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">      <div className="max-w-7xl mx-auto px-6 py-6">      {/* Stats */}      )}        </div>          </div>            <button onClick={() => setMessage({ type: '', text: '' })} className="float-right font-bold">×</button>            {message.text}          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>        <div className={`max-w-7xl mx-auto mt-4 px-6`}>      {message.text && (      {/* Message */}      </div>        </div>          </div>            </div>              </button>                ➕ Add New Product              >                className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"                }}                  setShowAddModal(true);                  resetForm();                onClick={() => {              <button              </Link>                ← Back to Store              >                className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"                to="/"              <Link            <div className="flex gap-3">            </div>              <p className="text-green-100 mt-1">Manage your GreenKart products</p>              <h1 className="text-3xl font-bold">🌿 Admin Dashboard</h1>            <div>          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">        <div className="max-w-7xl mx-auto">      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6">      {/* Header */}    <div className="min-h-screen bg-gray-100">  return (  );    </form>      </div>        </button>          {saving ? 'Saving...' : isEdit ? '💾 Update Product' : '➕ Add Product'}        >          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"          disabled={saving}          type="submit"        <button        </button>          Cancel        >          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"          }}            resetForm();            setShowEditModal(false);            setShowAddModal(false);          onClick={() => {          type="button"        <button      <div className="flex gap-3">      {/* Submit Button */}      )}        </div>          </div>            </div>              <p className="text-xs text-gray-500 mt-1">Grade</p>              </span>                {aiPrediction.sustainability_grade}              <span className={`inline-block w-8 h-8 rounded-full text-white font-bold flex items-center justify-center ${getGradeColor(aiPrediction.sustainability_grade)}`}>            <div className="text-center p-3 bg-white rounded-lg shadow-sm">            </div>              <p className="text-xs text-gray-500 mt-1">Impact</p>              </span>                {aiPrediction.impact_level}              <span className={`px-2 py-1 rounded text-sm ${getImpactColor(aiPrediction.impact_level)}`}>            <div className="text-center p-3 bg-white rounded-lg shadow-sm">            </div>              <p className="text-xs text-gray-500">Eco Score</p>              <p className="text-2xl font-bold text-blue-600">{aiPrediction.eco_score}</p>            <div className="text-center p-3 bg-white rounded-lg shadow-sm">            </div>              <p className="text-xs text-gray-500">kg CO₂</p>              <p className="text-2xl font-bold text-green-600">{aiPrediction.carbon_footprint?.toFixed(2)}</p>            <div className="text-center p-3 bg-white rounded-lg shadow-sm">          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">          <h4 className="font-semibold text-gray-800 mb-3">🌿 AI Prediction Results</h4>        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">      {aiPrediction && (      {/* AI Prediction Results */}      </div>        </button>          🤖 Predict Carbon Footprint with AI        >          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"          onClick={predictCarbonFootprint}          type="button"        <button      <div className="border-t pt-4">      {/* AI Prediction Button */}      </div>        </div>          />            placeholder="Product description..."            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            rows="3"            onChange={handleInputChange}            value={formData.description}            name="description"          <textarea          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>        <div className="md:col-span-2">        {/* Description */}        </div>          <p className="text-xs text-gray-500 mt-1">Leave empty for default placeholder</p>          />            placeholder="https://example.com/image.jpg"            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            onChange={handleInputChange}            value={formData.image}            name="image"            type="url"          <input          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>        <div className="md:col-span-2">        {/* Image URL */}        </div>          />            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            max="100"            min="0"            onChange={handleInputChange}            value={formData.waste_percent}            name="waste_percent"            type="number"          <input          <label className="block text-sm font-medium text-gray-700 mb-1">Waste Percent (%)</label>        <div>        {/* Waste Percent */}        </div>          />            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            min="0"            onChange={handleInputChange}            value={formData.transport_distance}            name="transport_distance"            type="number"          <input          <label className="block text-sm font-medium text-gray-700 mb-1">Transport Distance (km)</label>        <div>        {/* Transport Distance */}        </div>          </select>            ))}              <option key={color} value={color}>{color}</option>            {colors.map(color => (          >            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            onChange={handleInputChange}            value={formData.color}            name="color"          <select          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>        <div>        {/* Color */}        </div>          />            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            min="0.01"            step="0.01"            onChange={handleInputChange}            value={formData.weight}            name="weight"            type="number"          <input          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>        <div>        {/* Weight */}        </div>          />            placeholder="e.g., 999"            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            min="1"            required            onChange={handleInputChange}            value={formData.price}            name="price"            type="number"          <input          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>        <div>        {/* Price */}        </div>          </select>            ))}              <option key={c} value={c}>{c}</option>            {countries.map(c => (          >            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            onChange={handleInputChange}            value={formData.country}            name="country"          <select          <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin *</label>        <div>        {/* Country */}        </div>          </select>            ))}              <option key={mat} value={mat}>{mat.charAt(0).toUpperCase() + mat.slice(1)}</option>            {materials.map(mat => (          >            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            onChange={handleInputChange}            value={formData.material}            name="material"          <select          <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>        <div>        {/* Material */}        </div>          </select>            ))}              <option key={cat} value={cat}>{cat}</option>            {categories.map(cat => (          >            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"            onChange={handleInputChange}            value={formData.category}            name="category"          <select          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>        <div>        {/* Category */}        </div>          />            placeholder="e.g., Summer Cotton T-Shirt"            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"            required            onChange={handleInputChange}            value={formData.name}            name="name"            type="text"          <input          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>        <div className="md:col-span-2">        {/* Name */}      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">    <form onSubmit={onSubmit} className="space-y-4">  const ProductForm = ({ onSubmit, isEdit = false }) => (  // Product Form Component (reused for Add and Edit)  };    }      default: return 'bg-gray-500';      case 'E': return 'bg-red-500';      case 'D': return 'bg-orange-500';      case 'C': return 'bg-yellow-500';      case 'B': return 'bg-green-400';      case 'A': return 'bg-green-500';    switch (grade) {  const getGradeColor = (grade) => {  };    }      default: return 'bg-gray-100 text-gray-800';      case 'High': return 'bg-red-100 text-red-800';      case 'Medium': return 'bg-yellow-100 text-yellow-800';      case 'Low': return 'bg-green-100 text-green-800';    switch (level) {  const getImpactColor = (level) => {  });    return matchesSearch && matchesCategory;    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());  const filteredProducts = products.filter(product => {  };    setAiPrediction(null);    });      waste_percent: '10',      transport_distance: '500',      image: '',      description: '',      color: 'Black',      weight: '0.5',      price: '',      country: 'India',      material: 'cotton',      category: 'Topwear',      name: '',    setFormData({  const resetForm = () => {  };    setAiPrediction(null);    setShowEditModal(true);    });      waste_percent: (product.wastePercent || 10).toString(),      transport_distance: (product.distanceKm || 500).toString(),      image: product.image || '',      description: product.description || '',      color: product.color || 'Black',      weight: (product.productWeightKg || product.weight || 0.5).toString(),      price: product.price?.toString() || '',      country: product.countryOfOrigin || product.country || 'India',      material: product.material || product.materialType || 'cotton',      category: product.category || 'Topwear',      name: product.name || '',    setFormData({    setSelectedProduct(product);  const openEditModal = (product) => {  };    }      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete product' });    } catch (error) {      }        fetchProducts();        setMessage({ type: 'success', text: '🗑️ Product deleted successfully!' });      if (response.data.success) {      const response = await api.delete(`/api/products/${id}`);    try {        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;  const handleDelete = async (id, name) => {  };    }      setSaving(false);    } finally {      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update product' });    } catch (error) {      }        fetchProducts();        resetForm();        setSelectedProduct(null);        setShowEditModal(false);        setMessage({ type: 'success', text: '✅ Product updated successfully!' });      if (response.data.success) {      });        waste_percent: parseFloat(formData.waste_percent),        transport_distance: parseFloat(formData.transport_distance),        weight: parseFloat(formData.weight),        price: parseFloat(formData.price),        ...formData,      const response = await api.put(`/api/products/${selectedProduct.id}`, {    try {        setSaving(true);    e.preventDefault();  const handleUpdate = async (e) => {  };    }      setSaving(false);    } finally {      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create product' });    } catch (error) {      }        fetchProducts();        resetForm();        setShowAddModal(false);        setMessage({ type: 'success', text: '✅ Product created successfully!' });      if (response.data.success) {      });        waste_percent: parseFloat(formData.waste_percent),        transport_distance: parseFloat(formData.transport_distance),        weight: parseFloat(formData.weight),        price: parseFloat(formData.price),        ...formData,      const response = await api.post('/api/products', {            const prediction = await predictCarbonFootprint();      // First get AI prediction    try {        setAiPrediction(null);    setSaving(true);    e.preventDefault();  const handleCreate = async (e) => {  };    }      return null;      console.error('AI prediction error:', error);    } catch (error) {      return data;      setAiPrediction(data);      const data = await response.json();      });        }),          country: formData.country,          waste_percent: parseFloat(formData.waste_percent),          transport_distance: parseFloat(formData.transport_distance),          weight: parseFloat(formData.weight),          material: formData.material,        body: JSON.stringify({        headers: { 'Content-Type': 'application/json' },        method: 'POST',      const response = await fetch(`${aiServiceUrl}/api/predict/eco-score`, {      const aiServiceUrl = 'https://greenkart-ai.onrender.com';    try {  const predictCarbonFootprint = async () => {  };    setFormData(prev => ({ ...prev, [name]: value }));    const { name, value } = e.target;  const handleInputChange = (e) => {  };    }      setLoading(false);    } finally {      setMessage({ type: 'error', text: 'Failed to load products' });      console.error('Error fetching products:', error);    } catch (error) {      setProducts(data);      const data = response.data?.data?.products || response.data?.products || [];      const response = await api.get('/api/products?limit=500');    try {    setLoading(true);  const fetchProducts = async () => {  }, []);    fetchProducts();  useEffect(() => {  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Brown', 'Grey', 'Pink', 'Yellow', 'Navy'];  const countries = ['India', 'China', 'Bangladesh', 'Vietnam', 'USA', 'Italy', 'Turkey', 'Ethiopia'];  const materials = ['cotton', 'polyester', 'recycled', 'wool', 'linen', 'silk', 'denim'];  const categories = ['Topwear', 'Bottomwear', 'Fullbody', 'Outerwear', 'Accessories'];  });    waste_percent: '10',    transport_distance: '500',    image: '',    description: '',    color: 'Black',    weight: '0.5',    price: '',    country: 'India',    material: 'cotton',    category: 'Topwear',    name: '',  const [formData, setFormData] = useState({  // Form state    const [aiPrediction, setAiPrediction] = useState(null);  const [message, setMessage] = useState({ type: '', text: '' });  const [saving, setSaving] = useState(false);  const [selectedProduct, setSelectedProduct] = useState(null);  const [showEditModal, setShowEditModal] = useState(false);  const [showAddModal, setShowAddModal] = useState(false);  const [categoryFilter, setCategoryFilter] = useState('All');  const [searchTerm, setSearchTerm] = useState('');  const [loading, setLoading] = useState(true);  const [products, setProducts] = useState([]);const AdminDashboard = () => {const API_URL = import.meta.env.VITE_API_URL || 'https://green-kart.onrender.com';import api from '../services/api'; * ==============
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
  updateProduct,
  deleteProduct,
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

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product by ID
 * @access  Admin
 * 
 * Any field can be updated. If material/weight/transport changes,
 * the AI model will recalculate the carbon footprint.
 */
router.put('/:id', updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 * @access  Admin
 */
router.delete('/:id', deleteProduct);

module.exports = router;
