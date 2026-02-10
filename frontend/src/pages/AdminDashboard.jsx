import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [aiPrediction, setAiPrediction] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Topwear',
    material: 'cotton',
    country: 'India',
    price: '',
    weight: '0.5',
    color: 'Black',
    description: '',
    image: '',
    transport_distance: '500',
    waste_percent: '10',
  });

  const categories = ['Topwear', 'Bottomwear', 'Fullbody', 'Outerwear', 'Accessories'];
  const materials = ['cotton', 'polyester', 'recycled', 'wool', 'linen', 'silk', 'denim'];
  const countries = ['India', 'China', 'Bangladesh', 'Vietnam', 'USA', 'Italy', 'Turkey', 'Ethiopia'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Brown', 'Grey', 'Pink', 'Yellow', 'Navy'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products?limit=500');
      const data = response.data?.data?.products || response.data?.products || [];
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const predictCarbonFootprint = async () => {
    try {
      const aiServiceUrl = 'https://greenkart-ai.onrender.com';
      const response = await fetch(`${aiServiceUrl}/api/predict/eco-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material: formData.material,
          weight: parseFloat(formData.weight),
          transport_distance: parseFloat(formData.transport_distance),
          waste_percent: parseFloat(formData.waste_percent),
          country: formData.country,
        }),
      });
      const data = await response.json();
      setAiPrediction(data);
      return data;
    } catch (error) {
      console.error('AI prediction error:', error);
      return null;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAiPrediction(null);
    
    try {
      await predictCarbonFootprint();
      
      const response = await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        weight: parseFloat(formData.weight),
        transport_distance: parseFloat(formData.transport_distance),
        waste_percent: parseFloat(formData.waste_percent),
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Product created successfully!' });
        setShowAddModal(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create product' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await api.put(`/products/${selectedProduct.id}`, {
        ...formData,
        price: parseFloat(formData.price),
        weight: parseFloat(formData.weight),
        transport_distance: parseFloat(formData.transport_distance),
        waste_percent: parseFloat(formData.waste_percent),
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Product updated successfully!' });
        setShowEditModal(false);
        setSelectedProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update product' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        setMessage({ type: 'success', text: '🗑️ Product deleted successfully!' });
        fetchProducts();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete product' });
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Topwear',
      material: product.material || product.materialType || 'cotton',
      country: product.countryOfOrigin || product.country || 'India',
      price: product.price?.toString() || '',
      weight: (product.productWeightKg || product.weight || 0.5).toString(),
      color: product.color || 'Black',
      description: product.description || '',
      image: product.image || '',
      transport_distance: (product.distanceKm || 500).toString(),
      waste_percent: (product.wastePercent || 10).toString(),
    });
    setShowEditModal(true);
    setAiPrediction(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Topwear',
      material: 'cotton',
      country: 'India',
      price: '',
      weight: '0.5',
      color: 'Black',
      description: '',
      image: '',
      transport_distance: '500',
      waste_percent: '10',
    });
    setAiPrediction(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getImpactColor = (level) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-green-400';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const ProductForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Summer Cotton T-Shirt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
          <select
            name="material"
            value={formData.material}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {materials.map(mat => (
              <option key={mat} value={mat}>{mat.charAt(0).toUpperCase() + mat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            step="0.01"
            min="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <select
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transport Distance (km)</label>
          <input
            type="number"
            name="transport_distance"
            value={formData.transport_distance}
            onChange={handleInputChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Waste Percent (%)</label>
          <input
            type="number"
            name="waste_percent"
            value={formData.waste_percent}
            onChange={handleInputChange}
            min="0"
            max="100"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Product description..."
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <button
          type="button"
          onClick={predictCarbonFootprint}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
        >
          🤖 Predict Carbon Footprint with AI
        </button>
      </div>

      {aiPrediction && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-gray-800 mb-3">🌿 AI Prediction Results</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-green-600">{aiPrediction.carbon_footprint?.toFixed(2)}</p>
              <p className="text-xs text-gray-500">kg CO₂</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-blue-600">{aiPrediction.eco_score}</p>
              <p className="text-xs text-gray-500">Eco Score</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <span className={`px-2 py-1 rounded text-sm ${getImpactColor(aiPrediction.impact_level)}`}>
                {aiPrediction.impact_level}
              </span>
              <p className="text-xs text-gray-500 mt-1">Impact</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <span className={`inline-flex w-8 h-8 rounded-full text-white font-bold items-center justify-center ${getGradeColor(aiPrediction.sustainability_grade)}`}>
                {aiPrediction.sustainability_grade}
              </span>
              <p className="text-xs text-gray-500 mt-1">Grade</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            resetForm();
          }}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? '💾 Update Product' : '➕ Add Product'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">🌿 Admin Dashboard</h1>
              <p className="text-green-100 mt-1">Manage your GreenKart products</p>
            </div>
            <div className="flex gap-3">
              <Link to="/" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                ← Back to Store
              </Link>
              <button
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"
              >
                ➕ Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className="max-w-7xl mx-auto mt-4 px-6">
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })} className="float-right font-bold">×</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-gray-800">{products.length}</p>
            <p className="text-gray-500">Total Products</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-green-600">
              {products.filter(p => p.carbonImpactLevel === 'Low').length}
            </p>
            <p className="text-gray-500">🌿 Low Impact</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-yellow-600">
              {products.filter(p => p.carbonImpactLevel === 'Medium').length}
            </p>
            <p className="text-gray-500">🌱 Medium Impact</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-red-600">
              {products.filter(p => p.carbonImpactLevel === 'High').length}
            </p>
            <p className="text-gray-500">⚠️ High Impact</p>
          </div>
        </div>
        
        {/* Category Stats */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📊 Products by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat).length;
              return (
                <span
                  key={cat}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    count > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cat}: <strong>{count}</strong>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-auto p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button onClick={fetchProducts} className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No products found</p>
              <button onClick={() => setShowAddModal(true)} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
                Add your first product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carbon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eco Score</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.slice(0, 50).map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || '/images/placeholder.jpg'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                          />
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.material || product.materialType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">₹{product.price}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {(product.totalCarbonFootprint || product.carbonFootprint || 0).toFixed(2)} kg
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(product.carbonImpactLevel)}`}>
                          {product.carbonImpactLevel || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${product.ecoScore || 0}%` }} />
                          </div>
                          <span className="text-sm text-gray-600">{product.ecoScore || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openEditModal(product)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition text-sm">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition text-sm">
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length > 50 && (
                <div className="p-4 text-center text-gray-500 border-t">
                  Showing 50 of {filteredProducts.length} products. Use search to find more.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">➕ Add New Product</h2>
              <p className="text-gray-500">AI will predict the carbon footprint automatically</p>
            </div>
            <div className="p-6">
              <ProductForm onSubmit={handleCreate} isEdit={false} />
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Product</h2>
              <p className="text-gray-500">Editing: {selectedProduct.name}</p>
            </div>
            <div className="p-6">
              <ProductForm onSubmit={handleUpdate} isEdit={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
