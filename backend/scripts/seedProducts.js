/**
 * Product Database Seeder
 * =======================
 * 
 * This script populates the MongoDB database with 135 products
 * including complete carbon footprint data.
 * 
 * Usage:
 *   node scripts/seedProducts.js
 * 
 * What it does:
 * 1. Connects to MongoDB
 * 2. Clears existing products (optional)
 * 3. Inserts 135 products with carbon data
 * 4. Verifies the insertion
 * 
 * Carbon Footprint Data includes:
 * - Material type and impact
 * - Transport mode and distance
 * - Packaging type
 * - Calculated total carbon footprint
 * - Eco score (0-100)
 * - Impact level (Low/Medium/High)
 * 
 * Author: GreenKart Team
 * Version: 1.0.0
 * For: Final Year Project Evaluation
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../data/products');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greenkart';

/**
 * Main seeding function
 */
const seedProducts = async () => {
  console.log('🌱 =============================================');
  console.log('🌱 GreenKart Product Seeder');
  console.log('🌱 =============================================\n');

  try {
    // Step 1: Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    // Step 2: Check for existing products
    const existingCount = await Product.countDocuments();
    console.log(`📊 Existing products in database: ${existingCount}`);

    // Step 3: Clear existing products (with confirmation)
    if (existingCount > 0) {
      console.log('🗑️  Clearing existing products...');
      await Product.deleteMany({});
      console.log('✅ Existing products cleared\n');
    }

    // Step 4: Insert new products
    console.log(`📦 Inserting ${products.length} products with carbon footprint data...\n`);

    // Insert products in batches for better performance
    const batchSize = 25;
    let insertedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      insertedCount += batch.length;
      console.log(`   ✓ Inserted ${insertedCount}/${products.length} products`);
    }

    console.log('\n✅ All products inserted successfully!\n');

    // Step 5: Verify insertion and show statistics
    console.log('📊 =============================================');
    console.log('📊 DATABASE STATISTICS');
    console.log('📊 =============================================\n');

    const totalProducts = await Product.countDocuments();
    console.log(`Total Products: ${totalProducts}`);

    // Count by category
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📂 Products by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });

    // Count by carbon impact level
    const impactLevels = await Product.aggregate([
      { $group: { _id: '$carbonImpactLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n🌿 Products by Carbon Impact Level:');
    impactLevels.forEach(level => {
      const emoji = level._id === 'Low' ? '🟢' : level._id === 'Medium' ? '🟡' : '🔴';
      console.log(`   ${emoji} ${level._id}: ${level.count} products`);
    });

    // Calculate average carbon footprint
    const avgStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgFootprint: { $avg: '$totalCarbonFootprint' },
          avgEcoScore: { $avg: '$ecoScore' },
          minFootprint: { $min: '$totalCarbonFootprint' },
          maxFootprint: { $max: '$totalCarbonFootprint' }
        }
      }
    ]);

    if (avgStats.length > 0) {
      console.log('\n📈 Carbon Footprint Statistics:');
      console.log(`   Average Carbon Footprint: ${avgStats[0].avgFootprint.toFixed(2)} kg CO2`);
      console.log(`   Average Eco Score: ${Math.round(avgStats[0].avgEcoScore)}/100`);
      console.log(`   Min Carbon Footprint: ${avgStats[0].minFootprint.toFixed(2)} kg CO2`);
      console.log(`   Max Carbon Footprint: ${avgStats[0].maxFootprint.toFixed(2)} kg CO2`);
    }

    // Count eco-friendly products
    const ecoFriendlyCount = await Product.countDocuments({ isEcoFriendly: true });
    console.log(`\n🌱 Eco-Friendly Products: ${ecoFriendlyCount} (${((ecoFriendlyCount/totalProducts)*100).toFixed(1)}%)`);

    // Sample products to verify data
    console.log('\n📋 Sample Products:');
    const sampleProducts = await Product.find().limit(3).select('name category totalCarbonFootprint carbonImpactLevel ecoScore');
    sampleProducts.forEach((p, i) => {
      console.log(`\n   ${i + 1}. ${p.name}`);
      console.log(`      Category: ${p.category}`);
      console.log(`      Carbon Footprint: ${p.totalCarbonFootprint} kg CO2`);
      console.log(`      Impact Level: ${p.carbonImpactLevel}`);
      console.log(`      Eco Score: ${p.ecoScore}/100`);
    });

    console.log('\n🌱 =============================================');
    console.log('🌱 Seeding completed successfully!');
    console.log('🌱 =============================================\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('📡 MongoDB connection closed');
    process.exit(0);
  }
};

// Run the seeder
seedProducts();
