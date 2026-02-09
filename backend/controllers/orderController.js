/**
 * Order Controller
 * Handles order creation, storage in Firebase, and email notifications
 */

const { getDB } = require('../config/firebase');
const { sendOrderConfirmationEmail } = require('../services/emailService');

/**
 * Generate Order ID
 */
const generateOrderId = () => {
  return 'GK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

/**
 * Create a new order
 * @route POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      userName,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
      carbonSaved,
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address details are required',
      });
    }

    // Generate order ID
    const orderId = generateOrderId();
    
    // Prepare order data
    const orderData = {
      orderId,
      userId: userId || 'guest',
      userEmail: userEmail || shippingAddress.email,
      userName: userName || shippingAddress.fullName,
      items: items.map((item, index) => ({
        productId: item.productId || item.id || `item_${index}`,
        name: item.name || 'Unknown Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
        size: item.size || '',
        image: item.image || '',
        category: item.category || '',
        carbonFootprint: item.carbonFootprint || 0,
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        email: shippingAddress.email || '',
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed',
      },
      pricing: {
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        total: total || 0,
      },
      carbonSaved: carbonSaved || 0,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firebase
    const db = getDB();
    await db.collection('orders').doc(orderId).set(orderData);

    // Also save to user's orders subcollection if userId exists
    if (userId && userId !== 'guest') {
      await db.collection('users').doc(userId).collection('orders').doc(orderId).set({
        orderId,
        total: orderData.pricing.total,
        itemCount: items.length,
        status: orderData.status,
        createdAt: orderData.createdAt,
      });
    }

    // Send response immediately - don't wait for email
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: orderData.orderId,
        status: orderData.status,
        total: orderData.pricing.total,
        carbonSaved: orderData.carbonSaved,
        email: orderData.userEmail,
      },
    });

    // Send confirmation email in background (non-blocking)
    const emailData = {
      orderId: orderData.orderId,
      items: orderData.items,
      totalAmount: orderData.pricing.total,
      paymentMethod: orderData.payment.method,
      shippingAddress: {
        name: orderData.shippingAddress.fullName,
        address: orderData.shippingAddress.addressLine1,
        city: orderData.shippingAddress.city,
        pincode: orderData.shippingAddress.pincode,
      },
    };
    
    sendOrderConfirmationEmail(orderData.userEmail, emailData)
      .then((result) => {
        if (result.success) {
          console.log('✅ Order confirmation email sent to:', orderData.userEmail);
        } else {
          console.log('⚠️ Email not sent:', result.error || 'Unknown error');
        }
      })
      .catch((emailError) => console.error('⚠️ Failed to send email:', emailError.message));

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:orderId
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const db = getDB();
    const orderDoc = await db.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: orderDoc.data(),
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

/**
 * Get user's orders
 * @route GET /api/orders/user/:userId
 */
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const db = getDB();
    const ordersSnapshot = await db.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push(doc.data());
    });

    res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
};
