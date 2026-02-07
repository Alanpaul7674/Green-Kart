/**
 * Firebase Configuration
 * Initializes Firebase Admin SDK for backend services
 * 
 * Setup instructions:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Create a new project or select existing
 * 3. Go to Project Settings > Service Accounts
 * 4. Click "Generate new private key"
 * 5. Save the JSON file as 'serviceAccountKey.json' in the config folder
 * 
 * For Render deployment, set these environment variables:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_CLIENT_EMAIL  
 * - FIREBASE_PRIVATE_KEY (paste the full key, Render will handle escaping)
 */

const admin = require('firebase-admin');
const path = require('path');

let db = null;
let isInitialized = false;

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      db = admin.firestore();
      isInitialized = true;
      return db;
    }

    // Try to load service account key from file first
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    
    let serviceAccount;
    try {
      serviceAccount = require(serviceAccountPath);
      console.log('📁 Using serviceAccountKey.json file');
    } catch (err) {
      // If no service account file, try environment variables
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        // Handle private key - it may be escaped or have literal \n
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        // Log key info for debugging (first 50 chars only)
        console.log('🔑 Private key starts with:', privateKey.substring(0, 50));
        console.log('🔑 Private key length:', privateKey.length);
        
        // Replace literal \n with actual newlines (handles JSON escaped format)
        privateKey = privateKey.replace(/\\n/g, '\n');
        
        // Also handle double-escaped newlines
        privateKey = privateKey.replace(/\\\\n/g, '\n');
        
        // If the key is wrapped in quotes, remove them
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1);
          privateKey = privateKey.replace(/\\n/g, '\n');
        }
        
        // If the key is wrapped in single quotes, remove them
        if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
          privateKey = privateKey.slice(1, -1);
          privateKey = privateKey.replace(/\\n/g, '\n');
        }
        
        // Ensure proper format
        if (!privateKey.includes('-----BEGIN')) {
          console.error('❌ Private key format is invalid - missing BEGIN marker');
          throw new Error('FIREBASE_PRIVATE_KEY format is invalid');
        }
        
        serviceAccount = {
          type: 'service_account',
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key: privateKey,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
        };
        console.log('🔑 Using environment variables for Firebase');
        console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
        console.log(`   Client Email: ${process.env.FIREBASE_CLIENT_EMAIL}`);
        console.log(`   Private Key valid format: ${privateKey.includes('-----BEGIN PRIVATE KEY-----')}`);
      } else {
        console.error('❌ Missing Firebase environment variables:');
        console.error(`   FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✓' : '✗ missing'}`);
        console.error(`   FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? '✓' : '✗ missing'}`);
        console.error(`   FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? '✓' : '✗ missing'}`);
        throw new Error('Firebase service account not found. Please add serviceAccountKey.json or set environment variables.');
      }
    }

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    isInitialized = true;
    console.log('✅ Firebase Connected Successfully');
    
    return db;
  } catch (error) {
    console.error('❌ Firebase Connection Error:', error.message);
    isInitialized = false;
    throw error;
  }
};

/**
 * Get Firestore database instance
 */
const getDB = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
};

module.exports = {
  initializeFirebase,
  getDB,
  admin,
};
