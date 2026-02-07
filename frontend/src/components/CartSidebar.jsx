/**
 * Cart Sidebar Component
 * Slide-out cart with items, quantities, and checkout
 */

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Handle checkout - navigate to checkout page
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      navigate('/login');
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🛒 Your Cart
            {cartCount > 0 && (
              <span className="bg-white text-green-600 text-sm px-2 py-0.5 rounded-full">
                {cartCount} items
              </span>
            )}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-green-200 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">🛒</span>
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-green-600 font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 bg-gray-50 p-3 rounded-lg"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                    <p className="text-gray-500 text-xs">Size: {item.size}</p>
                    <p className="text-green-600 font-bold mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 rounded bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 rounded bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="ml-auto text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full text-red-500 text-sm mb-4 hover:underline"
            >
              Clear Cart
            </button>

            {/* Subtotal */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Carbon Savings Preview */}
            {cartItems.length > 0 && (
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <span>🌱</span>
                  <span>
                    You'll save approximately <strong>
                      {cartItems.reduce((acc, item) => {
                        const avgCarbon = 8;
                        const itemCarbon = item.totalCarbonFootprint || 2;
                        return acc + (avgCarbon - itemCarbon) * item.quantity;
                      }, 0).toFixed(1)} kg CO₂
                    </strong> with this purchase!
                  </span>
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full mt-2 text-gray-600 py-2 text-sm hover:text-green-600"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
