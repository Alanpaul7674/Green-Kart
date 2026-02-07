/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose
 * 
 * Usage: Import and call connectDB() in server.js
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses the MONGODB_URI from environment variables
 * 
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    // Set connection timeout
    mongoose.set('bufferCommands', false);
    
    // Attempt to connect to MongoDB with timeout
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    // Log successful connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    // Log error but don't exit - let server continue
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error; // Re-throw so server.js can handle it
  }
};

module.exports = connectDB;
