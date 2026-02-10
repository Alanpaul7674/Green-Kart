/**
 * Products Page
 * Displays a grid of products with filters, search, carbon footprint badges and eco-sorting
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productApi';
import { CarbonBadgeCompact, EcoScoreRing, calculateEcoScore } from '../components/CarbonBadge';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImpact, setSelectedImpact] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts({ limit: 500 });
        if (response.success && response.data?.products) {
          setProducts(response.data.products);
          const uniqueCategories = ['All', ...new Set(response.data.products.map(p => p.category))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedImpact !== 'All') {
      result = result.filter(p => p.carbonImpactLevel === selectedImpact);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.materialType?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'eco-high':
        // Higher eco score = lower carbon footprint
        result = [...result].sort((a, b) => (a.totalCarbonFootprint || 0) - (b.totalCarbonFootprint || 0));
        break;
      case 'eco-low':
        // Lower eco score = higher carbon footprint
        result = [...result].sort((a, b) => (b.totalCarbonFootprint || 0) - (a.totalCarbonFootprint || 0));
        break;
      case 'carbon-low':
        result = [...result].sort((a, b) => (a.totalCarbonFootprint || 0) - (b.totalCarbonFootprint || 0));
        break;
      case 'carbon-high':
        result = [...result].sort((a, b) => (b.totalCarbonFootprint || 0) - (a.totalCarbonFootprint || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, selectedImpact, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleImpactChange = (impact) => {
    setSelectedImpact(impact);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedImpact('All');
    setSearchQuery('');
    setSortBy('default');
    setCurrentPage(1);
  };

  const getImpactButtonClass = (impact, isSelected) => {
    if (!isSelected) return 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200';
    if (impact === 'Low') return 'bg-green-600 text-white shadow-lg';
    if (impact === 'Medium') return 'bg-yellow-500 text-white shadow-lg';
    if (impact === 'High') return 'bg-red-500 text-white shadow-lg';
    return 'bg-gray-700 text-white shadow-lg';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading eco-friendly products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <p className="text-gray-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Eco Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of {products.length}+ sustainable fashion items.
            Each product shows its carbon footprint to help you make eco-conscious choices! 🌿
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search products, materials..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
          </div>
          <div className="md:w-64">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="eco-high">🌿 Eco Score: High to Low</option>
              <option value="eco-low">Eco Score: Low to High</option>
              <option value="carbon-low">🌍 Carbon: Low to High</option>
              <option value="carbon-high">Carbon: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Carbon Impact Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span className="text-sm text-gray-500 self-center mr-2">Carbon Impact:</span>
          {['All', 'Low', 'Medium', 'High'].map((impact) => (
            <button
              key={impact}
              onClick={() => handleImpactChange(impact)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${getImpactButtonClass(impact, selectedImpact === impact)}`}
            >
              {impact === 'Low' && '🌿 '}
              {impact === 'Medium' && '🌱 '}
              {impact === 'High' && '⚠️ '}
              {impact}
              {impact !== 'All' && (
                <span className="ml-1 text-xs opacity-75">
                  ({products.filter(p => p.carbonImpactLevel === impact).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 shadow-sm'
              }`}
            >
              {category}
              <span className="ml-1 text-xs opacity-75">
                ({category === 'All' ? products.length : products.filter(p => p.category === category).length})
              </span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 flex items-center justify-between">
          <span>
            Showing {paginatedProducts.length} of {filteredProducts.length} products
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedImpact !== 'All' || sortBy !== 'default') && (
            <button onClick={clearFilters} className="text-green-600 hover:text-green-700 font-medium text-sm">
              Clear filters ✕
            </button>
          )}
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <Link
                key={product.id || product._id}
                to={`/product/${product.id || product._id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] group"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {product.category}
                  </span>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md">
                    <EcoScoreRing score={product.ecoScore} size="sm" totalCarbonFootprint={product.totalCarbonFootprint} />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold transition-opacity duration-300">
                      View Details →
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <CarbonBadgeCompact ecoScore={product.ecoScore} carbonImpactLevel={product.carbonImpactLevel} totalCarbonFootprint={product.totalCarbonFootprint} />
                    <span className="text-xs text-gray-500">{product.totalCarbonFootprint?.toFixed(2)} kg CO₂</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-2xl font-bold text-green-600">₹{product.price?.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-400 capitalize">{product.materialType?.replace('_', ' ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
            <button onClick={clearFilters} className="text-green-600 hover:text-green-700 font-medium">
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
            >
              ← Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
