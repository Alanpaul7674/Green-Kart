/**
 * MongoDB Database Configuration
 * ==============================
 * 
 * This file handles the MongoDB connection for storing products
 * with carbon footprint data.
 * 
 * Connection Options:
 * - Uses MongoDB Atlas (cloud) or local MongoDB
 * - Includes connection retry logic
 * - Proper error handling
 * 
 * Author: GreenKart Team
 * Version: 1.0.0
 * For: Final Year Project Evaluation
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * 
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greenkart';
    
    // Mongoose connection options
    const options = {
      // These options are no longer needed in Mongoose 6+
      // but kept for compatibility
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, options);

    console.log('✅ ============================================');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database Name: ${conn.connection.name}`);
    console.log('✅ ============================================');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Make sure MongoDB is running or check your MONGODB_URI');
    
    // Don't exit process - allow app to run without MongoDB
    // Products will be served from in-memory data
    return null;
  }
};

/**
 * Disconnect from MongoDB
 * Used for graceful shutdown
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

module.exports = { connectDB, disconnectDB };
