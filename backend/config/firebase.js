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
 */

const admin = require('firebase-admin');
const path = require('path');

let db = null;

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      db = admin.firestore();
      return db;
    }

    // Try to load service account key
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    
    let serviceAccount;
    try {
      serviceAccount = require(serviceAccountPath);
    } catch (err) {
      // If no service account file, try environment variables
      if (process.env.FIREBASE_PROJECT_ID) {
        serviceAccount = {
          type: 'service_account',
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
        };
      } else {
        throw new Error('Firebase service account not found. Please add serviceAccountKey.json or set environment variables.');
      }
    }

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log('✅ Firebase Connected Successfully');
    
    return db;
  } catch (error) {
    console.error('❌ Firebase Connection Error:', error.message);
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
