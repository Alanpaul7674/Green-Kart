/**
 * Layout Component
 * Wraps all pages with Navbar and Footer
 * Provides consistent layout structure across the app
 */

import Navbar from './Navbar';
import Footer from './Footer';
import CarbonSavingsWidget from './CarbonSavingsWidget';
import CartSidebar from './CartSidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar at the top */}
      <Navbar />
      
      {/* Main content area - grows to fill available space */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
      
      {/* Cart Sidebar */}
      <CartSidebar />
      
      {/* Floating Carbon Savings Widget */}
      <CarbonSavingsWidget />
    </div>
  );
};

export default Layout;
