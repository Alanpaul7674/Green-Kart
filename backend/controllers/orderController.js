/**
 * Order Controller
 * Handles order creation, storage in Firebase, and email notifications
 */

const { getDB } = require('../config/firebase');
const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'greenkart.eco@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password',
    },
  });
};

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

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(orderData);
      console.log('✅ Order confirmation email sent to:', orderData.userEmail);
    } catch (emailError) {
      console.error('⚠️ Failed to send email:', emailError.message);
      // Don't fail the order if email fails
    }

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
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (order) => {
  const transporter = createTransporter();

  // Create items HTML
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666;">Size: ${item.size} | Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - GreenKart</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🌿 GreenKart</h1>
        <p style="color: #dcfce7; margin: 10px 0 0;">Eco-Friendly Fashion</p>
      </div>
      
      <!-- Order Confirmation -->
      <div style="background: #f0fdf4; padding: 20px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
        <h2 style="color: #16a34a; margin: 0;">Order Confirmed!</h2>
        <p style="color: #666; margin: 10px 0 0;">Thank you for shopping eco-friendly, ${order.userName}!</p>
      </div>
      
      <!-- Order Details -->
      <div style="padding: 20px; background: white; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #374151;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
            <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 16px;">${order.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Date:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Payment:</strong></td>
            <td style="padding: 8px 0; text-align: right; text-transform: uppercase;">${order.payment.method}</td>
          </tr>
        </table>
      </div>
      
      <!-- Items -->
      <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-top: none;">
        <h3 style="margin-top: 0; color: #374151;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>
        
        <!-- Totals -->
        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0;">Subtotal</td>
            <td style="padding: 8px 0; text-align: right;">₹${order.pricing.subtotal.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Shipping</td>
            <td style="padding: 8px 0; text-align: right; color: #16a34a;">${order.pricing.shipping > 0 ? '₹' + order.pricing.shipping : 'FREE'}</td>
          </tr>
          <tr style="font-size: 18px; font-weight: bold;">
            <td style="padding: 12px 0; border-top: 2px solid #16a34a;">Total</td>
            <td style="padding: 12px 0; border-top: 2px solid #16a34a; text-align: right; color: #16a34a;">₹${order.pricing.total.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>
      
      <!-- Carbon Savings -->
      <div style="background: #dcfce7; padding: 20px; text-align: center; border: 1px solid #bbf7d0;">
        <div style="font-size: 32px; margin-bottom: 10px;">🌱</div>
        <h3 style="color: #16a34a; margin: 0;">You saved ${order.carbonSaved.toFixed(1)} kg CO₂!</h3>
        <p style="color: #15803d; margin: 10px 0 0; font-size: 14px;">
          By choosing eco-friendly products, you're helping protect our planet.
        </p>
      </div>
      
      <!-- Delivery Address -->
      <div style="padding: 20px; background: white; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #374151;">📍 Delivery Address</h3>
        <p style="margin: 0; color: #666;">
          ${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.addressLine1}<br>
          ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
          Phone: ${order.shippingAddress.phone}
        </p>
      </div>
      
      <!-- Footer -->
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 12px 12px; background: #f9fafb;">
        <p style="margin: 0 0 10px;">
          Need help? Contact us at <a href="mailto:support@greenkart.com" style="color: #16a34a;">support@greenkart.com</a>
        </p>
        <p style="margin: 0;">
          © ${new Date().getFullYear()} GreenKart. All rights reserved.<br>
          <span style="color: #16a34a;">🌿 Sustainable Fashion for a Better Tomorrow</span>
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"GreenKart" <${process.env.EMAIL_USER || 'greenkart.eco@gmail.com'}>`,
    to: order.userEmail,
    subject: `✅ Order Confirmed - ${order.orderId} | GreenKart`,
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
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
