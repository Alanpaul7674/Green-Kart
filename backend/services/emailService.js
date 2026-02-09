/**
 * Email Service
 * Centralized email functionality using Brevo (Sendinblue) API
 * Free tier: 300 emails/day - Works on Render via HTTP API
 * Sends FROM your Gmail address (greenkart4u@gmail.com)
 */

const SibApiV3Sdk = require('@getbrevo/brevo');

// Initialize Brevo API
const getBrevoClient = () => {
  if (!process.env.BREVO_API_KEY) {
    console.warn('⚠️ BREVO_API_KEY not configured - emails will be logged only');
    return null;
  }
  
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  return apiInstance;
};

// Sender email - your Gmail address
const SENDER_EMAIL = process.env.EMAIL_USER || 'greenkart4u@gmail.com';
const SENDER_NAME = 'GreenKart';

/**
 * Send Welcome Email to new users
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  const apiInstance = getBrevoClient();
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
            🛒 GreenKart
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            Sustainable Fashion Marketplace
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Welcome Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 60px; margin-bottom: 15px;">🌱</div>
            <h2 style="color: #16a34a; margin: 0 0 10px; font-size: 28px;">
              Welcome, ${userName}!
            </h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
              Thank you for joining GreenKart! You're now part of a community that cares about sustainable fashion.
            </p>
          </div>
          
          <!-- Benefits Section -->
          <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #15803d; margin: 0 0 20px; font-size: 18px; text-align: center;">
              What You'll Love About GreenKart
            </h3>
            
            <table style="width: 100%;">
              <tr>
                <td style="padding: 10px 0; vertical-align: top; width: 40px;">
                  <span style="font-size: 24px;">🌍</span>
                </td>
                <td style="padding: 10px 0; padding-left: 12px;">
                  <strong style="color: #166534;">Carbon Footprint Tracking</strong>
                  <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">
                    See the environmental impact of every product you buy
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; vertical-align: top;">
                  <span style="font-size: 24px;">♻️</span>
                </td>
                <td style="padding: 10px 0; padding-left: 12px;">
                  <strong style="color: #166534;">Eco-Friendly Products</strong>
                  <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">
                    Curated collection of sustainable, organic, and recycled fashion
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; vertical-align: top;">
                  <span style="font-size: 24px;">🏆</span>
                </td>
                <td style="padding: 10px 0; padding-left: 12px;">
                  <strong style="color: #166534;">Eco Score System</strong>
                  <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">
                    Make informed choices with our product sustainability ratings
                  </p>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://greenkart-gules.vercel.app/products" 
               style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4);">
              Start Shopping Sustainably →
            </a>
          </div>
          
          <!-- Stats -->
          <table style="width: 100%; text-align: center; margin-bottom: 30px;">
            <tr>
              <td>
                <div style="font-size: 28px; font-weight: bold; color: #16a34a;">220+</div>
                <div style="color: #6b7280; font-size: 12px;">Eco Products</div>
              </td>
              <td>
                <div style="font-size: 28px; font-weight: bold; color: #16a34a;">50+</div>
                <div style="color: #6b7280; font-size: 12px;">Brands</div>
              </td>
              <td>
                <div style="font-size: 28px; font-weight: bold; color: #16a34a;">100%</div>
                <div style="color: #6b7280; font-size: 12px;">Sustainable</div>
              </td>
            </tr>
          </table>
          
          <!-- Footer Message -->
          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 15px;">
              Every purchase you make helps reduce fashion's environmental impact. 
              Together, we can make a difference! 🌿
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              If you have any questions, just reply to this email - we're here to help!
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 25px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 10px;">
            © 2026 GreenKart - Sustainable Fashion Marketplace
          </p>
          <p style="margin: 0;">
            Made with 💚 for a greener planet
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  if (!apiInstance) {
    console.log(`📧 [MOCK] Welcome email would be sent to ${userEmail}`);
    return { success: true, mock: true };
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = '🌱 Welcome to GreenKart - Your Eco-Fashion Journey Begins!';
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: userEmail, name: userName }];
    sendSmtpEmail.replyTo = { email: SENDER_EMAIL, name: SENDER_NAME };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Welcome email sent to ${userEmail} (ID: ${result.messageId})`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Order Confirmation Email
 * @param {string} userEmail - User's email address
 * @param {Object} orderDetails - Order information
 */
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const apiInstance = getBrevoClient();
  
  const { orderId, items = [], totalAmount, paymentMethod, shippingAddress } = orderDetails;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #374151;">${item.name || 'Product'}</strong>
        <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Qty: ${item.quantity || 1}</p>
      </td>
      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151;">
        ₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛒 GreenKart</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Order Confirmation</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Success Message -->
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
            <h2 style="color: #16a34a; margin: 0 0 8px; font-size: 24px;">Order Confirmed!</h2>
            <p style="color: #6b7280; margin: 0;">Thank you for shopping sustainably</p>
          </div>
          
          <!-- Order Info -->
          <div style="background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; padding: 5px 0;">Order ID:</td>
                <td style="text-align: right; color: #374151; font-weight: bold;">#${orderId}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 5px 0;">Payment:</td>
                <td style="text-align: right; color: #374151;">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 5px 0;">Status:</td>
                <td style="text-align: right;">
                  <span style="background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                    ${paymentMethod === 'cod' ? 'Processing' : 'Paid'}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Order Items -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px; font-size: 16px;">Order Items</h3>
            <table style="width: 100%;">
              ${itemsHtml || `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151;">
                    Your eco-friendly items
                  </td>
                </tr>
              `}
            </table>
          </div>
          
          <!-- Total -->
          <div style="background: #f0fdf4; border-radius: 10px; padding: 15px; margin-bottom: 25px;">
            <table style="width: 100%;">
              <tr>
                <td style="font-size: 18px; font-weight: bold; color: #16a34a;">Total Amount:</td>
                <td style="text-align: right; font-size: 22px; font-weight: bold; color: #16a34a;">
                  ₹${totalAmount?.toFixed(2) || '0.00'}
                </td>
              </tr>
            </table>
          </div>
          
          ${shippingAddress ? `
          <!-- Shipping Address -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 10px; font-size: 14px;">📍 Shipping To:</h3>
            <p style="color: #6b7280; margin: 0; line-height: 1.5; font-size: 14px;">
              ${shippingAddress.name || ''}<br>
              ${shippingAddress.address || ''}<br>
              ${shippingAddress.city || ''} ${shippingAddress.pincode || ''}
            </p>
          </div>
          ` : ''}
          
          <!-- Track Order Button -->
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="https://greenkart-gules.vercel.app/orders" 
               style="display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-weight: bold; font-size: 14px;">
              Track Your Order →
            </a>
          </div>
          
          <!-- Footer Message -->
          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              🌱 Thank you for choosing sustainable fashion!
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 11px;">
          <p style="margin: 0;">© 2026 GreenKart - Made with 💚 for a greener planet</p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  if (!apiInstance) {
    console.log(`📧 [MOCK] Order confirmation email would be sent to ${userEmail}`);
    console.log(`   Order ID: ${orderId}, Amount: ₹${totalAmount}`);
    return { success: true, mock: true };
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `✅ Order Confirmed - #${orderId} | GreenKart`;
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: userEmail }];
    sendSmtpEmail.replyTo = { email: SENDER_EMAIL, name: SENDER_NAME };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Order confirmation sent to ${userEmail} (ID: ${result.messageId})`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send order confirmation:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Password Reset Email
 * @param {string} userEmail - User's email address
 * @param {string} resetLink - Password reset link
 */
const sendPasswordResetEmail = async (userEmail, resetLink) => {
  const apiInstance = getBrevoClient();
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0;">🛒 GreenKart</h1>
        </div>
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
          <p style="color: #666; text-align: center;">
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #16a34a; color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            This link expires in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!apiInstance) {
    console.log(`📧 [MOCK] Password reset email would be sent to ${userEmail}`);
    return { success: true, mock: true };
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = '🔐 Reset Your GreenKart Password';
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: userEmail }];
    sendSmtpEmail.replyTo = { email: SENDER_EMAIL, name: SENDER_NAME };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send test email (for debugging)
 */
const sendTestEmail = async (toEmail) => {
  const apiInstance = getBrevoClient();
  
  if (!apiInstance) {
    console.log(`📧 [MOCK] Test email would be sent to ${toEmail}`);
    return { 
      success: true, 
      mock: true, 
      message: 'BREVO_API_KEY not configured - email logged only' 
    };
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = '🧪 GreenKart Email Test';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h1 style="color: #16a34a;">✅ Email Test Successful!</h1>
        <p>Your GreenKart email configuration is working correctly.</p>
        <p style="color: #666;">Sent at: ${new Date().toISOString()}</p>
        <p style="color: #666;">From: ${SENDER_EMAIL}</p>
        <p style="color: #16a34a;">🌱 GreenKart - Sustainable Fashion Marketplace</p>
      </div>
    `;
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: toEmail }];
    sendSmtpEmail.replyTo = { email: SENDER_EMAIL, name: SENDER_NAME };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Test email sent to ${toEmail} (ID: ${result.messageId})`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Legacy compatibility
const createTransporter = () => null;

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendTestEmail,
  createTransporter,
};
