/**
 * Email Service
 * Supports multiple email providers:
 * 1. Brevo (Sendinblue) API - if BREVO_API_KEY is set
 * 2. Gmail SMTP via Nodemailer - if EMAIL_USER and EMAIL_PASS are set
 */

const nodemailer = require('nodemailer');

// Check for Brevo SDK
let SibApiV3Sdk;
try {
  SibApiV3Sdk = require('@getbrevo/brevo');
} catch (e) {
  console.log('Brevo SDK not installed, using Nodemailer only');
}

// Sender config
const SENDER_EMAIL = process.env.EMAIL_USER || 'greenkart4u@gmail.com';
const SENDER_NAME = 'GreenKart';

// Initialize Gmail transporter (Nodemailer)
const getGmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not configured');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Initialize Brevo API client
const getBrevoClient = () => {
  if (!process.env.BREVO_API_KEY || !SibApiV3Sdk) {
    return null;
  }
  
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  return apiInstance;
};

/**
 * Send email using available method (Brevo or Gmail SMTP)
 */
const sendEmail = async (to, subject, htmlContent) => {
  const brevoClient = getBrevoClient();
  const gmailTransporter = getGmailTransporter();
  
  // Try Brevo first
  if (brevoClient) {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
      sendSmtpEmail.to = [{ email: to }];
      sendSmtpEmail.replyTo = { email: SENDER_EMAIL, name: SENDER_NAME };
      
      const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
      console.log(`✅ Email sent via Brevo to ${to}`);
      return { success: true, provider: 'brevo', messageId: result.messageId };
    } catch (error) {
      console.log('Brevo failed, trying Gmail SMTP:', error.message);
    }
  }
  
  // Fallback to Gmail SMTP
  if (gmailTransporter) {
    try {
      const result = await gmailTransporter.sendMail({
        from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
        to: to,
        subject: subject,
        html: htmlContent,
      });
      console.log(`✅ Email sent via Gmail SMTP to ${to}`);
      return { success: true, provider: 'gmail', messageId: result.messageId };
    } catch (error) {
      console.error('Gmail SMTP failed:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  // No email provider available
  console.log(`📧 [MOCK] Email would be sent to ${to}: ${subject}`);
  return { success: true, mock: true };
};

/**
 * Send Welcome Email to new users
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🛒 GreenKart</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Sustainable Fashion Marketplace</p>
        </div>
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 60px; margin-bottom: 15px;">🌱</div>
            <h2 style="color: #16a34a; margin: 0 0 10px; font-size: 28px;">Welcome, ${userName}!</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">Thank you for joining GreenKart! You're now part of a community that cares about sustainable fashion.</p>
          </div>
          <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #15803d; margin: 0 0 20px; font-size: 18px; text-align: center;">What You'll Love About GreenKart</h3>
            <p style="margin: 10px 0;"><span style="font-size: 20px;">🌍</span> <strong>Carbon Footprint Tracking</strong> - See environmental impact of every product</p>
            <p style="margin: 10px 0;"><span style="font-size: 20px;">♻️</span> <strong>Eco-Friendly Products</strong> - Sustainable, organic, recycled fashion</p>
            <p style="margin: 10px 0;"><span style="font-size: 20px;">🏆</span> <strong>AI-Powered Eco Score</strong> - Make informed choices</p>
          </div>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://greenkart-gules.vercel.app/products" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">Start Shopping Sustainably →</a>
          </div>
          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Every purchase helps reduce fashion's environmental impact 🌿</p>
          </div>
        </div>
        <div style="text-align: center; padding: 25px; color: #6b7280; font-size: 12px;">
          <p>© 2026 GreenKart - Made with 💚 for a greener planet</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail(userEmail, '🌱 Welcome to GreenKart - Your Eco-Fashion Journey Begins!', emailHtml);
};

/**
 * Send Order Confirmation Email
 */
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const { orderId, items = [], totalAmount, paymentMethod, shippingAddress } = orderDetails;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>${item.name || 'Product'}</strong><br><small>Qty: ${item.quantity || 1}</small></td>
      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
    </tr>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f0fdf4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛒 GreenKart</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Order Confirmation</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
            <h2 style="color: #16a34a; margin: 0 0 8px; font-size: 24px;">Order Confirmed!</h2>
            <p style="color: #6b7280; margin: 0;">Thank you for shopping sustainably</p>
          </div>
          <div style="background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Payment:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</p>
            <p><strong>Status:</strong> <span style="background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${paymentMethod === 'cod' ? 'Processing' : 'Paid'}</span></p>
          </div>
          <h3 style="color: #374151; margin: 0 0 15px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table>
          <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #16a34a;">
            <p style="font-size: 20px; font-weight: bold; color: #16a34a; margin: 0;">Total: ₹${totalAmount?.toFixed(2) || '0.00'}</p>
          </div>
          ${shippingAddress ? `<div style="background: #f9fafb; border-radius: 10px; padding: 15px; margin-top: 20px;">
            <h4 style="margin: 0 0 10px; color: #374151;">📦 Shipping To:</h4>
            <p style="margin: 0; color: #6b7280;">${shippingAddress.name}<br>${shippingAddress.street}<br>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}</p>
          </div>` : ''}
        </div>
        <div style="text-align: center; padding: 25px; color: #6b7280; font-size: 12px;">
          <p>© 2026 GreenKart - Made with 💚 for a greener planet</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail(userEmail, `✅ Order Confirmed - #${orderId} | GreenKart`, emailHtml);
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (userEmail, resetLink) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f0fdf4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛒 GreenKart</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 15px;">🔒</div>
          <h2 style="color: #374151; margin: 0 0 15px;">Password Reset Request</h2>
          <p style="color: #6b7280; margin: 0 0 25px;">Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold;">Reset Password</a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 25px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail(userEmail, '🔒 Reset Your GreenKart Password', emailHtml);
};

/**
 * Send test email
 */
const sendTestEmail = async (toEmail) => {
  const emailHtml = `
    <div style="font-family: sans-serif; padding: 20px; text-align: center;">
      <h1 style="color: #16a34a;">✅ Email Test Successful!</h1>
      <p>Your GreenKart email configuration is working correctly.</p>
      <p style="color: #666;">Sent at: ${new Date().toISOString()}</p>
      <p style="color: #16a34a;">🌱 GreenKart - Sustainable Fashion Marketplace</p>
    </div>
  `;
  
  return sendEmail(toEmail, '🧪 GreenKart Email Test', emailHtml);
};

// Legacy compatibility
const createTransporter = getGmailTransporter;

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendTestEmail,
  sendEmail,
  createTransporter,
};
