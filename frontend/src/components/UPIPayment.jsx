/**
 * UPI Payment Component with Razorpay Integration
 * Sends payment request directly to user's UPI app (GPay, PhonePe, etc.)
 */

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// UPI Configuration
const UPI_CONFIG = {
  merchantName: 'GreenKart',
  merchantUpiId: 'richardantonyjojo1@oksbi',
  upiApps: [
    { name: 'Google Pay', icon: '💳', scheme: 'gpay://' },
    { name: 'PhonePe', icon: '📱', scheme: 'phonepe://' },
    { name: 'Paytm', icon: '💰', scheme: 'paytm://' },
    { name: 'BHIM', icon: '🏦', scheme: 'bhim://' },
  ]
};

const UPIPayment = ({ amount, orderId, onPaymentComplete, customerEmail, customerName, customerPhone }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [showQR, setShowQR] = useState(true);
  const [customerUpiId, setCustomerUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Generate UPI Payment URL for QR Code
  const generateUPIUrl = () => {
    const params = new URLSearchParams({
      pa: UPI_CONFIG.merchantUpiId,
      pn: UPI_CONFIG.merchantName,
      am: amount.toFixed(2),
      cu: 'INR',
      tn: `GreenKart Order ${orderId}`,
      tr: orderId,
    });
    return `upi://pay?${params.toString()}`;
  };

  // Get QR Code URL
  const getQRCodeUrl = () => {
    const upiUrl = generateUPIUrl();
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}&bgcolor=ffffff&color=000000&format=png`;
  };

  // Open UPI app directly
  const openUPIApp = () => {
    const upiUrl = generateUPIUrl();
    window.location.href = upiUrl;
  };

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_CONFIG.merchantUpiId);
    alert('UPI ID copied to clipboard!');
  };

  // Initiate UPI Collect Request via Razorpay
  const initiateUPICollect = async () => {
    if (!customerUpiId || !customerUpiId.includes('@')) {
      setErrorMessage('Please enter a valid UPI ID (e.g., name@upi)');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Create order on backend
      const orderResponse = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          orderId: orderId,
          currency: 'INR',
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Initialize Razorpay checkout with UPI
      if (!razorpayLoaded) {
        throw new Error('Payment gateway is loading. Please try again.');
      }

      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'GreenKart',
        description: `Order #${orderId}`,
        order_id: orderData.data.orderId,
        prefill: {
          name: customerName || '',
          email: customerEmail || '',
          contact: customerPhone || '',
          vpa: customerUpiId, // Pre-fill the UPI ID
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['collect'], // This triggers the collect request!
                    apps: ['google_pay', 'phonepe', 'paytm'],
                  },
                ],
              },
            },
            sequence: ['block.upi'],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        handler: async function (response) {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setPaymentStatus('success');
              if (onPaymentComplete) {
                onPaymentComplete({
                  method: 'upi',
                  transactionId: response.razorpay_payment_id,
                  upiId: customerUpiId,
                  amount: amount,
                  status: 'success',
                });
              }
            } else {
              setPaymentStatus('failed');
              setErrorMessage('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            setPaymentStatus('failed');
            setErrorMessage('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            setPaymentStatus('pending');
          },
        },
        theme: {
          color: '#16a34a', // Green theme
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setPaymentStatus('failed');
        setErrorMessage(response.error.description || 'Payment failed');
        setIsLoading(false);
      });
      razorpay.open();
      setIsLoading(false);

    } catch (error) {
      console.error('Payment initiation error:', error);
      setErrorMessage(error.message || 'Failed to initiate payment');
      setIsLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Your order has been confirmed</p>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">❌</span>
        </div>
        <h3 className="text-xl font-bold text-red-600 mb-2">Payment Failed</h3>
        <p className="text-gray-600 mb-4">{errorMessage || 'Something went wrong'}</p>
        <button
          onClick={() => {
            setPaymentStatus('pending');
            setErrorMessage('');
          }}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* UPI Payment Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Pay via UPI</h3>
            <p className="text-white/80 text-sm">Get payment request on your UPI app</p>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600 text-sm">Amount to Pay</p>
        <p className="text-3xl font-bold text-green-600">₹{amount.toLocaleString('en-IN')}</p>
      </div>

      {/* Tab Selection */}
      <div className="flex border-b">
        <button
          onClick={() => setShowQR(true)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            showQR ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📷 Scan QR Code
        </button>
        <button
          onClick={() => setShowQR(false)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            !showQR ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📲 Enter UPI ID
        </button>
      </div>

      {showQR ? (
        /* QR Code Section */
        <div className="text-center">
          <div className="bg-white p-4 rounded-xl inline-block shadow-lg border-2 border-gray-100">
            <img
              src={getQRCodeUrl()}
              alt="UPI QR Code"
              className="w-64 h-64 mx-auto"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="250" height="250"><rect fill="%23f0f0f0" width="250" height="250"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666">QR Code</text></svg>';
              }}
            />
          </div>

          <p className="mt-4 text-gray-600 text-sm">
            Scan this QR code with any UPI app
          </p>

          {/* UPI Apps Quick Links */}
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            {UPI_CONFIG.upiApps.map((app) => (
              <button
                key={app.name}
                onClick={openUPIApp}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>{app.icon}</span>
                <span className="text-sm font-medium">{app.name}</span>
              </button>
            ))}
          </div>

          {/* Manual UPI ID Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Or pay to this UPI ID:</p>
            <div className="flex items-center justify-center gap-2">
              <code className="bg-white px-4 py-2 rounded-lg font-mono text-lg font-semibold text-purple-600 border">
                {UPI_CONFIG.merchantUpiId}
              </code>
              <button
                onClick={copyUpiId}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                title="Copy UPI ID"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Enter UPI ID Section - This sends collect request! */
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-blue-800">How it works</h4>
                <p className="text-sm text-blue-700">
                  Enter your UPI ID and click Pay. You'll receive a payment request 
                  notification on your GPay/PhonePe/Paytm app. Just approve it to complete payment!
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your UPI ID
            </label>
            <input
              type="text"
              value={customerUpiId}
              onChange={(e) => {
                setCustomerUpiId(e.target.value);
                setErrorMessage('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="yourname@okaxis, yourname@ybl, yourname@paytm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the UPI ID linked to your GPay, PhonePe, or Paytm
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <button
            onClick={initiateUPICollect}
            disabled={isLoading || !customerUpiId}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              isLoading || !customerUpiId
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Sending Request...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>📲</span>
                Pay ₹{amount.toLocaleString('en-IN')} - Get Request on UPI App
              </span>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            🔔 You'll receive a notification on your UPI app to approve payment
          </p>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm border-t pt-4">
        <span>🔒</span>
        <span>Secure UPI Payment powered by Razorpay</span>
      </div>
    </div>
  );
};

export default UPIPayment;
