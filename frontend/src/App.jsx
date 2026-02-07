/**
 * GreenKart - Main App Component
 * 
 * This is the root component that sets up:
 * - React Router for navigation
 * - Authentication context provider
 * - Cart context provider
 * - Layout wrapper with Navbar and Footer
 * - Route definitions for all pages
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout component
import Layout from './components/Layout';

// Components
import CartSidebar from './components/CartSidebar';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Home Page - Landing page */}
              <Route path="/" element={<Home />} />
              
              {/* Login Page - User authentication */}
              <Route path="/login" element={<Login />} />
              
              {/* Register Page - User registration */}
              <Route path="/register" element={<Register />} />
              
              {/* Products Page - Product listing */}
              <Route path="/products" element={<Products />} />
              
              {/* Product Detail Page - Single product view */}
              <Route path="/product/:id" element={<ProductDetail />} />
              
              {/* Checkout Page - Address, Payment, Confirmation */}
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </Layout>
          <CartSidebar />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
