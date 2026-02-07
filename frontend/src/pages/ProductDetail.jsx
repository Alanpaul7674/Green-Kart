/**
 * Product Detail Page
 * Shows single product with carbon footprint breakdown, size selection and similar products
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById, getSimilarProducts } from '../services/productApi';
import { CarbonBadgeFull, EcoScoreRing } from '../components/CarbonBadge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        if (response.success && response.data) {
          setProduct(response.data);
          // Similar products are now included in the same response
          if (response.similarProducts && response.similarProducts.length > 0) {
            setSimilarProducts(response.similarProducts);
          } else {
            // Fallback: try fetching separately
            try {
              const similarResponse = await getSimilarProducts(id, 4);
              if (similarResponse.success && similarResponse.data) {
                setSimilarProducts(similarResponse.data);
              }
            } catch (err) {
              console.warn('Could not fetch similar products');
            }
          }
        } else {
          navigate('/products');
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        navigate('/products');
      } finally {
        setLoading(false);
      }
      setSelectedSize('');
      setQuantity(1);
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    addToCart(product, selectedSize, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getImpactColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <p className="text-gray-600 text-lg">Product not found</p>
          <Link to="/products" className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-green-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-green-600">Products</Link></li>
            <li>/</li>
            <li><Link to={`/products?category=${product.category}`} className="hover:text-green-600">{product.category}</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            ✓ Added to cart successfully!
          </div>
        )}

        {/* Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              <span className="absolute top-4 left-4 bg-green-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                {product.category}
              </span>
              {/* Eco Score Badge on Image */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <EcoScoreRing score={product.ecoScore} size="md" />
                <p className="text-xs text-center text-gray-500 mt-1">Eco Score</p>
              </div>
              {/* Carbon Impact Badge */}
              <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full font-medium ${getImpactColor(product.carbonImpactLevel)}`}>
                {product.carbonImpactLevel === 'Low' && '🌿 '}
                {product.carbonImpactLevel === 'Medium' && '🌱 '}
                {product.carbonImpactLevel === 'High' && '⚠️ '}
                {product.carbonImpactLevel} Carbon Impact
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-4xl font-bold text-green-600 mb-4">
                  ₹{product.price?.toLocaleString('en-IN')}
                </p>
                
                {/* Material Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                    {product.materialType?.replace('_', ' ')} Material
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                    {product.transportMode} Transport
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Select Size <span className="text-red-500">*</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-green-600 text-white ring-2 ring-green-600 ring-offset-2'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="text-sm text-gray-500 mt-2">Please select a size to continue</p>
                  )}
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 font-bold text-xl hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 font-bold text-xl hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    selectedSize
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedSize ? `Add to Cart - ₹${(product.price * quantity).toLocaleString('en-IN')}` : 'Select Size to Add to Cart'}
                </button>
                
                <Link
                  to="/products"
                  className="block w-full py-4 text-center rounded-xl font-semibold text-lg border-2 border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600 transition-all duration-200"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Product Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">🚚</span>
                    <p className="text-gray-600 mt-1">Free Delivery</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">↩️</span>
                    <p className="text-gray-600 mt-1">Easy Returns</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">🌿</span>
                    <p className="text-gray-600 mt-1">Eco-Friendly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carbon Footprint Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Carbon Footprint Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🌍 Carbon Footprint Analysis
            </h2>
            <CarbonBadgeFull
              totalCarbonFootprint={product.totalCarbonFootprint}
              ecoScore={product.ecoScore}
              carbonImpactLevel={product.carbonImpactLevel}
              materialImpact={product.materialImpact}
              transportImpact={product.transportImpact}
              packagingImpact={product.packagingImpact}
              recommendations={product.recommendations}
            />
          </div>

          {/* Product Sustainability Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              ♻️ Sustainability Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">🧵 Material</span>
                <span className="font-semibold capitalize">{product.materialType?.replace('_', ' ')}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">⚖️ Product Weight</span>
                <span className="font-semibold">{product.productWeightKg} kg</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">🚚 Transport Mode</span>
                <span className="font-semibold capitalize">{product.transportMode}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">📍 Distance Traveled</span>
                <span className="font-semibold">{product.distanceKm?.toLocaleString()} km</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">📦 Packaging</span>
                <span className="font-semibold capitalize">{product.packagingType}</span>
              </div>
            </div>

            {/* Carbon Comparison */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <h3 className="font-semibold text-green-800 mb-2">🌱 Environmental Impact</h3>
              <p className="text-sm text-green-700">
                This product's total carbon footprint of <strong>{product.totalCarbonFootprint?.toFixed(2)} kg CO₂</strong> is 
                {product.carbonImpactLevel === 'Low' && ' below average, making it an eco-friendly choice!'}
                {product.carbonImpactLevel === 'Medium' && ' moderate. Consider offsetting with our carbon credits program.'}
                {product.carbonImpactLevel === 'High' && ' above average. We plant a tree for every purchase of this item.'}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Eco Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <Link
                  key={item.id || item._id}
                  to={`/product/${item.id || item._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.ecoScore && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md">
                        <EcoScoreRing score={item.ecoScore} size="sm" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xl font-bold text-green-600">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </p>
                      {item.totalCarbonFootprint && (
                        <span className="text-xs text-gray-500">{item.totalCarbonFootprint?.toFixed(2)} kg CO₂</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
