/**
 * GreenKart Backend Server
 * Main entry point for the Node.js/Express backend
 * 
 * This file:
 * - Loads environment variables
 * - Sets up Express middleware
 * - Connects to Firebase
 * - Mounts API routes
 * - Starts the server
 */

// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const { initializeFirebase } = require('./config/firebase');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

/**
 * Middleware Setup
 */

// CORS Configuration - Allow both development and production origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 */

// Mount all API routes under /api prefix
app.use('/api', routes);

// Root route - Basic server info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GreenKart API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      // TODO: Add more endpoints as they are created
    },
  });
});

/**
 * Error Handling Middleware
 */

// Handle 404 - Route not found
app.use(notFound);

// Handle all other errors
app.use(errorHandler);

/**
 * Start Server
 * Connect to Firebase first, then start listening
 */
const startServer = async () => {
  try {
    // Initialize Firebase
    initializeFirebase();
  } catch (error) {
    console.warn('⚠️  Firebase connection failed. Running without database.');
    console.warn('⚠️  Some features may not work. Please add Firebase credentials.');
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log('🚀 ============================================');
    console.log(`🚀 GreenKart Backend Server`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`🚀 Health check: http://localhost:${PORT}/api/health`);
    console.log('🚀 ============================================');
  });
};

// Start the server
startServer();
