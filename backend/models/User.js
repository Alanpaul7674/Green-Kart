/**
 * User Model for Firebase Firestore
 * Handles user data operations
 */

const bcrypt = require('bcryptjs');
const { getDB } = require('../config/firebase');

// Collection name in Firestore
const COLLECTION = 'users';

/**
 * User Model - Firebase Firestore implementation
 */
const User = {
  /**
   * Create a new user
   * @param {object} userData - { name, email, password }
   * @returns {object} Created user data
   */
  async create(userData) {
    const db = getDB();
    const { name, email, password } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const userDoc = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to Firestore
    const docRef = await db.collection(COLLECTION).add(userDoc);
    
    return {
      _id: docRef.id,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
    };
  },

  /**
   * Find user by email
   * @param {string} email 
   * @returns {object|null} User data or null
   */
  async findByEmail(email) {
    const db = getDB();
    const snapshot = await db
      .collection(COLLECTION)
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      _id: doc.id,
      ...doc.data(),
    };
  },

  /**
   * Find user by ID
   * @param {string} id 
   * @returns {object|null} User data or null
   */
  async findById(id) {
    const db = getDB();
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      _id: doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
    };
  },

  /**
   * Compare password with hashed password
   * @param {string} enteredPassword 
   * @param {string} hashedPassword 
   * @returns {boolean}
   */
  async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  /**
   * Update user
   * @param {string} id 
   * @param {object} updateData 
   * @returns {object} Updated user
   */
  async update(id, updateData) {
    const db = getDB();
    await db.collection(COLLECTION).doc(id).update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return await this.findById(id);
  },

  /**
   * Delete user
   * @param {string} id 
   */
  async delete(id) {
    const db = getDB();
    await db.collection(COLLECTION).doc(id).delete();
  },
};

module.exports = User;
