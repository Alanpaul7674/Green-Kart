/**
 * Checkout Page
 * Multi-step checkout with address, payment, and order confirmation
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderApi';
import UPIPayment from '../components/UPIPayment';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Address form state
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  // Payment form state
  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
  });

  // Calculate carbon savings
  const carbonSaved = cartItems.reduce((acc, item) => {
    const avgCarbon = 8; // Average carbon footprint for non-eco products
    const itemCarbon = item.totalCarbonFootprint || 2;
    return acc + (avgCarbon - itemCarbon) * item.quantity;
  }, 0);

  // Redirect if cart is empty or not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (cartItems.length === 0 && !orderPlaced) {
      navigate('/products');
    }
  }, [cartItems, isAuthenticated, navigate, orderPlaced]);

  // Handle address form change
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Handle payment form change
  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  // Validate address
  const validateAddress = () => {
    const required = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field].trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{10}$/.test(address.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  // Validate payment
  const validatePayment = () => {
    if (payment.method === 'card') {
      if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return false;
      }
      if (!payment.cardName.trim()) {
        alert('Please enter cardholder name');
        return false;
      }
      if (!payment.expiry || !/^\d{2}\/\d{2}$/.test(payment.expiry)) {
        alert('Please enter expiry in MM/YY format');
        return false;
      }
      if (!payment.cvv || payment.cvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV');
        return false;
      }
    } else if (payment.method === 'upi') {
      if (!payment.upiId || !payment.upiId.includes('@')) {
        alert('Please enter a valid UPI ID');
        return false;
      }
    }
    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && validateAddress()) {
      setStep(2);
    } else if (step === 2 && validatePayment()) {
      processOrder();
    }
  };

  // Process order
  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Prepare order data for API
      const orderData = {
        userId: user?.id || user?.uid || 'guest',
        userEmail: address.email,
        userName: address.fullName,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
          carbonFootprint: item.totalCarbonFootprint || item.carbonFootprint || 2,
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          email: address.email,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod: payment.method,
        subtotal: cartTotal,
        shipping: cartTotal > 499 ? 0 : 49,
        total: cartTotal + (cartTotal > 499 ? 0 : 49),
        carbonSaved: carbonSaved,
      };

      // Call backend API to create order
      const response = await createOrder(orderData);
      
      if (response.success) {
        const newOrderId = response.data?.orderId || response.orderId;
        setOrderId(newOrderId);
        
        // Save purchase history for local carbon tracking (user-specific)
        const userId = user?.id || user?.uid || user?.email;
        const storageKey = userId ? `purchaseHistory_${userId}` : 'purchaseHistory_guest';
        const existingPurchases = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newPurchases = cartItems.map(item => ({
          ...item,
          purchaseDate: new Date().toISOString(),
          orderId: newOrderId,
        }));
        localStorage.setItem(storageKey, JSON.stringify([...existingPurchases, ...newPurchases]));
        
        // Clear cart
        clearCart();
        
        setOrderPlaced(true);
        setStep(3);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > s ? '✓' : s}
          </div>
          {s < 3 && (
            <div className={`w-16 h-1 ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  // Order Summary Component
  const OrderSummary = () => (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex gap-3">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-gray-500 text-xs">Size: {item.size} × {item.quantity}</p>
              <p className="text-green-600 font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="text-green-600">FREE</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (GST 18%)</span>
          <span>₹{Math.round(cartTotal * 0.18).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-green-600">₹{Math.round(cartTotal * 1.18).toLocaleString('en-IN')}</span>
        </div>
      </div>
      
      {/* Carbon Savings */}
      <div className="mt-4 bg-green-100 rounded-lg p-3">
        <p className="text-sm text-green-700 flex items-center gap-2">
          <span>🌱</span>
          <span>You'll save <strong>{carbonSaved.toFixed(1)} kg CO₂</strong> with this order!</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="flex justify-center gap-8 mt-4 text-sm text-gray-500">
            <span className={step >= 1 ? 'text-green-600 font-medium' : ''}>1. Address</span>
            <span className={step >= 2 ? 'text-green-600 font-medium' : ''}>2. Payment</span>
            <span className={step >= 3 ? 'text-green-600 font-medium' : ''}>3. Confirmation</span>
          </div>
        </div>
        
        <StepIndicator />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>📍</span> Delivery Address
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={address.email}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="House/Flat No., Building Name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Street, Area, Landmark"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Mumbai"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="400001"
                      maxLength={6}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <Link
                    to="/products"
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Back to Shop
                  </Link>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>💳</span> Payment Method
                </h2>
                
                {/* Payment Method Selection */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setPayment({ ...payment, method: 'card' })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      payment.method === 'card' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-2xl block mb-1">💳</span>
                    <span className="font-medium">Credit/Debit Card</span>
                  </button>
                  <button
                    onClick={() => setPayment({ ...payment, method: 'upi' })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      payment.method === 'upi' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-2xl block mb-1">📱</span>
                    <span className="font-medium">UPI</span>
                  </button>
                  <button
                    onClick={() => setPayment({ ...payment, method: 'cod' })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      payment.method === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-2xl block mb-1">💵</span>
                    <span className="font-medium">Cash on Delivery</span>
                  </button>
                </div>
                
                {/* Card Payment Form */}
                {payment.method === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={payment.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                          setPayment({ ...payment, cardNumber: formatted });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={payment.cardName}
                        onChange={handlePaymentChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="JOHN DOE"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiry"
                          value={payment.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2);
                            }
                            setPayment({ ...payment, expiry: value });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                        <input
                          type="password"
                          name="cvv"
                          value={payment.cvv}
                          onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* UPI Payment Form with QR Code */}
                {payment.method === 'upi' && (
                  <UPIPayment
                    amount={Math.round(cartTotal * 1.18)}
                    orderId={`GK${Date.now().toString().slice(-8)}`}
                    merchantUpiId="richardantonyjojo1@oksbi" // Your UPI ID
                    onPaymentComplete={(paymentDetails) => {
                      setPayment({ ...payment, upiId: paymentDetails.upiId, transactionId: paymentDetails.transactionId });
                      processOrder();
                    }}
                  />
                )}
                
                {/* COD Info */}
                {payment.method === 'cod' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      <strong>Cash on Delivery:</strong> Pay when your order arrives. 
                      Additional ₹50 COD charges apply.
                    </p>
                  </div>
                )}
                
                {/* Secure Payment Badge */}
                <div className="mt-6 flex items-center gap-2 text-gray-500 text-sm">
                  <span>🔒</span>
                  <span>Your payment information is secure and encrypted</span>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                  >
                    ← Back to Address
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${Math.round(cartTotal * 1.18).toLocaleString('en-IN')}`
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && orderPlaced && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✓</span>
                </div>
                
                <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-4">Thank you for shopping eco-friendly!</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-xl font-bold text-gray-900">{orderId}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-green-700 font-medium">🌱 You saved {carbonSaved.toFixed(1)} kg CO₂ with this order!</p>
                  <p className="text-sm text-green-600 mt-1">Your carbon savings have been updated in your profile.</p>
                </div>
                
                <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">Delivery Address:</h3>
                  <p className="text-gray-600">
                    {address.fullName}<br />
                    {address.addressLine1}<br />
                    {address.addressLine2 && <>{address.addressLine2}<br /></>}
                    {address.city}, {address.state} - {address.pincode}<br />
                    Phone: {address.phone}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Link
                    to="/products"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/"
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Go to Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
