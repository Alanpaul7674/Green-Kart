/**
 * Email Service
 * Centralized email functionality for the application
 * Handles welcome emails, order confirmations, and other notifications
 */

const nodemailer = require('nodemailer');

// Create reusable transporter with connection pool
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true, // Use connection pool
      maxConnections: 3,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });
  }
  return transporter;
};

// Legacy function for backward compatibility
const createTransporter = getTransporter;

/**
 * Send Welcome Email to new users
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"GreenKart 🌿" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🌱 Welcome to GreenKart - Your Eco-Fashion Journey Begins!',
    html: `
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
              
              <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 24px; margin-right: 12px;">🌍</span>
                  <div>
                    <strong style="color: #166534;">Carbon Footprint Tracking</strong>
                    <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">
                      See the environmental impact of every product you buy
                    </p>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 24px; margin-right: 12px;">♻️</span>
                  <div>
                    <strong style="color: #166534;">Eco-Friendly Products</strong>
                    <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">
                      Curated collection of sustainable, organic, and recycled fashion
                    </p>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 24px; margin-right: 12px;">🏆</span>
                  <div>
                    <strong style="color: #166534;">Eco Score System</strong>
                    <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">
                      Make informed choices with our product sustainability ratings
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 24px; margin-right: 12px;">📊</span>
                  <div>
                    <strong style="color: #166534;">Personal Carbon Dashboard</strong>
                    <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">
                      Track your carbon savings and environmental impact over time
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" 
                 style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4);">
                Start Shopping Sustainably →
              </a>
            </div>
            
            <!-- Stats -->
            <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 30px; text-align: center;">
              <div>
                <div style="font-size: 28px; font-weight: bold; color: #16a34a;">220+</div>
                <div style="color: #6b7280; font-size: 12px;">Eco Products</div>
              </div>
              <div>
                <div style="font-size: 28px; font-weight: bold; color: #16a34a;">50+</div>
                <div style="color: #6b7280; font-size: 12px;">Brands</div>
              </div>
              <div>
                <div style="font-size: 28px; font-weight: bold; color: #16a34a;">100%</div>
                <div style="color: #6b7280; font-size: 12px;">Sustainable</div>
              </div>
            </div>
            
            <!-- Divider -->
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <!-- Footer Message -->
            <div style="text-align: center;">
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Password Reset Email
 * @param {string} userEmail - User's email address
 * @param {string} resetLink - Password reset link
 */
const sendPasswordResetEmail = async (userEmail, resetLink) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"GreenKart 🌿" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🔐 Reset Your GreenKart Password',
    html: `
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  createTransporter,
};
