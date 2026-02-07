/**
 * Navbar Component
 * A responsive, green-themed navigation bar for GreenKart
 * 
 * Features:
 * - Responsive design (mobile hamburger menu)
 * - Green theme matching the brand
 * - Active link highlighting
 * - User authentication state display
 * - Shopping cart with item count
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get current location for active link styling
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get auth state
  const { user, isAuthenticated, logout } = useAuth();
  
  // Get cart state
  const { cartCount, setIsCartOpen } = useCart();

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Check if a link is currently active
  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="bg-green-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="GreenKart Logo" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-lg bg-white/10 p-1"
              loading="eager"
              fetchPriority="high"
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; 
              }}
            />
            <span className="text-white text-lg sm:text-xl font-bold">GreenKart</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-white font-medium transition-all duration-200 hover:text-green-200 ${
                isActiveLink('/') ? 'border-b-2 border-white pb-1' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-white font-medium transition-all duration-200 hover:text-green-200 ${
                isActiveLink('/products') ? 'border-b-2 border-white pb-1' : ''
              }`}
            >
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <span className="text-green-100">
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white font-medium transition-all duration-200 hover:text-green-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`text-white font-medium transition-all duration-200 hover:text-green-200 ${
                  isActiveLink('/login') ? 'border-b-2 border-white pb-1' : ''
                }`}
              >
                Login
              </Link>
            )}
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-white hover:text-green-200 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                // X icon when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-2 text-white font-medium hover:bg-green-700 px-4 rounded transition-colors ${
                isActiveLink('/') ? 'bg-green-700' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-2 text-white font-medium hover:bg-green-700 px-4 rounded transition-colors ${
                isActiveLink('/products') ? 'bg-green-700' : ''
              }`}
            >
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="py-2 px-4 text-green-100">
                  Hi, {user?.name?.split(' ')[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-white font-medium hover:bg-green-700 px-4 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-white font-medium hover:bg-green-700 px-4 rounded transition-colors ${
                  isActiveLink('/login') ? 'bg-green-700' : ''
                }`}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
