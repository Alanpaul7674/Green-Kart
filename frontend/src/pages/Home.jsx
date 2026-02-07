/**
 * Home Page
 * Landing page for GreenKart / ECOSwap
 * Features a full-screen hero section with fashion image and eco products
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/productApi';
import { EcoScoreRing } from '../components/CarbonBadge';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [ecoProducts, setEcoProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch lowest carbon footprint products
  useEffect(() => {
    const fetchEcoProducts = async () => {
      try {
        const response = await getProducts({ 
          sortBy: 'carbonFootprint', 
          order: 'asc', 
          limit: 8,
          impactLevel: 'Low'
        });
        if (response.success && response.data?.products) {
          setEcoProducts(response.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch eco products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEcoProducts();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/products');
    } else {
      navigate('/register');
    }
  };

  return (
    <div>
      {/* Full Screen Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full screen background image - using img tag for better mobile compatibility */}
        <img 
          src="/hero-fashion.jpg"
          alt="Sustainable Fashion"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ minHeight: '100vh' }}
        />
        
        {/* Fallback background color */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-600 -z-10" />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        
        {/* Content overlay */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-3xl ml-8 lg:ml-24">
          {/* Eco badge */}
          <div className="inline-flex items-center gap-2 text-green-400 font-medium text-sm mb-6">
            <span className="text-lg">🌿</span>
            <span>Fashion with a lower footprint</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Style that doesn't cost the Earth
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
            Discover fashion that looks good and does good. GreenKart helps you find 
            stylish alternatives with a lower carbon footprint.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-green-700 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span>Shop Now</span>
            </Link>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center gap-2 bg-gray-800/80 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-full hover:bg-gray-700 transition-all duration-300 text-lg border border-gray-600"
            >
              <span>Learn More</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Lowest Carbon Footprint Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              🌱 Eco Champions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lowest Carbon Footprint Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop our most sustainable products with the lowest environmental impact. 
              Every purchase helps reduce your carbon footprint.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ecoProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Eco badge */}
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <span>🌿</span>
                      <span>Low Impact</span>
                    </div>
                    {/* Eco Score */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-1 shadow-md">
                      <EcoScoreRing score={product.ecoScore} size="sm" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-green-600">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>🌍</span>
                        <span>{product.totalCarbonFootprint?.toFixed(2)} kg CO₂</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link
              to="/products?impactLevel=Low"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition-colors"
            >
              <span>View All Eco Products</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How GreenKart Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make sustainable shopping simple and transparent
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Browse Products
              </h3>
              <p className="text-gray-600">
                Explore our curated collection of sustainable fashion with detailed carbon footprint data.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Compare Impact
              </h3>
              <p className="text-gray-600">
                See the environmental impact of each product with our AI-powered carbon analysis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Shop & Save
              </h3>
              <p className="text-gray-600">
                Make eco-conscious choices and track your carbon savings over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GreenKart?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👕</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Sustainable Fashion
              </h3>
              <p className="text-gray-600 text-sm">
                Curated eco-friendly clothing collection
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Smart carbon footprint calculations
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Track Your Impact
              </h3>
              <p className="text-gray-600 text-sm">
                See your environmental savings grow
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Carbon-Neutral Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                All shipping emissions offset
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto text-lg">
            Join thousands of eco-conscious shoppers making sustainable choices every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-block bg-white text-green-600 font-semibold py-4 px-10 rounded-full hover:bg-green-50 transition-colors shadow-lg text-lg"
            >
              Start Shopping
            </Link>
            <button
              onClick={handleGetStarted}
              className="inline-block bg-transparent border-2 border-white text-white font-semibold py-4 px-10 rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              {isAuthenticated ? 'View Your Impact' : 'Create Account'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
