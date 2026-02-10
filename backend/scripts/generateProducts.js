/**
 * Generate Products from CSV Dataset
 * ===================================
 * 
 * This script generates products.js from the product_with_sustainability.csv
 * Uses the AI model data for sustainability calculations
 * 
 * Run with: node scripts/generateProducts.js
 */

const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../../product_with_sustainability.csv');
const imagesDir = path.join(__dirname, '../../images');

// Get list of available images
const availableImages = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
console.log(`Found ${availableImages.length} product images`);

// Create image lookup map (prod_id -> filename)
const imageMap = {};
availableImages.forEach(img => {
  const match = img.match(/^(P\d+)/);
  if (match) {
    imageMap[match[1]] = img;
  }
});

// Material emission factors
const MATERIAL_FACTORS = {
  polyester: 5.5,
  nylon: 6.0,
  acrylic: 5.0,
  synthetic: 5.5,
  cotton: 2.1,
  wool: 2.5,
  linen: 1.5,
  silk: 2.8,
  leather: 3.5,
  denim: 2.3,
  organic_cotton: 1.2,
  recycled_polyester: 1.8,
  recycled_cotton: 1.0,
  bamboo: 0.8,
  hemp: 0.7,
  recycled: 1.0,
};

// Transport modes by country
const COUNTRY_TRANSPORT = {
  'USA': 'sea',
  'Australia': 'sea',
  'India': 'road',
  'China': 'sea',
  'UK': 'sea',
  'Germany': 'road',
  'France': 'road',
  'Italy': 'road',
  'Brazil': 'sea',
  'Canada': 'sea',
};

const TRANSPORT_FACTORS = {
  air: 0.001095,
  road: 0.000105,
  rail: 0.000028,
  sea: 0.000016,
};

// Prices by category
const PRICE_RANGES = {
  'T-Shirt': { min: 499, max: 999 },
  'Shirt': { min: 799, max: 1499 },
  'Blouse': { min: 699, max: 1299 },
  'Dress': { min: 1499, max: 2999 },
  'Jeans': { min: 1299, max: 2499 },
  'Shorts': { min: 599, max: 1199 },
  'Skirt': { min: 899, max: 1799 },
  'Sweater': { min: 999, max: 1999 },
  'Jacket': { min: 1999, max: 3999 },
  'Coat': { min: 2499, max: 4999 },
};

// Product descriptions by type
const DESCRIPTIONS = {
  'T-Shirt': 'Comfortable and sustainable t-shirt made with eco-friendly materials. Perfect for everyday wear.',
  'Shirt': 'Stylish button-up shirt crafted from sustainable fabrics. Ideal for both casual and formal occasions.',
  'Blouse': 'Elegant blouse designed with sustainability in mind. Features a flattering fit and eco-conscious materials.',
  'Dress': 'Beautiful dress made from planet-friendly fabrics. Perfect for any special occasion.',
  'Jeans': 'Classic jeans produced using sustainable manufacturing processes. Durable and eco-friendly.',
  'Shorts': 'Comfortable shorts perfect for warm weather. Made with sustainable materials.',
  'Skirt': 'Fashionable skirt crafted from eco-friendly materials. Versatile and sustainable.',
  'Sweater': 'Cozy sweater made with sustainable fibers. Stay warm while staying green.',
  'Jacket': 'Stylish jacket featuring sustainable construction. Perfect for layering.',
  'Coat': 'Premium coat made with eco-conscious materials. Warmth meets sustainability.',
};

// Parse CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim();
    });
    return obj;
  });
}

// Calculate carbon footprint
function calculateCarbon(product) {
  const material = product.material.toLowerCase();
  const weight = parseFloat(product.weight);
  const distance = parseFloat(product.transport_distance);
  const country = product.countryname;
  const wastePercent = parseFloat(product.waste_percent);
  const cValue = parseFloat(product.c_value); // Carbon value from AI model
  
  const materialFactor = MATERIAL_FACTORS[material] || 3.0;
  const transportMode = COUNTRY_TRANSPORT[country] || 'road';
  const transportFactor = TRANSPORT_FACTORS[transportMode];
  
  // Material impact
  const materialImpact = parseFloat((materialFactor * weight).toFixed(2));
  
  // Transport impact
  const transportImpact = parseFloat((transportFactor * weight * distance).toFixed(2));
  
  // Packaging impact (based on waste percent - lower is better, use recycled packaging)
  const packagingType = wastePercent <= 10 ? 'recycled' : wastePercent <= 15 ? 'paper' : 'cardboard';
  const packagingFactors = { recycled: 0.10, paper: 0.25, cardboard: 0.20 };
  const packagingImpact = packagingFactors[packagingType];
  
  // Use c_value from CSV if available, otherwise calculate
  const totalCarbonFootprint = cValue > 0 ? cValue : parseFloat((materialImpact + transportImpact + packagingImpact).toFixed(2));
  
  let carbonImpactLevel;
  if (totalCarbonFootprint <= 5.0) {
    carbonImpactLevel = 'Low';
  } else if (totalCarbonFootprint <= 15.0) {
    carbonImpactLevel = 'Medium';
  } else {
    carbonImpactLevel = 'High';
  }
  
  // Calculate eco score (0-100, higher is better)
  // Based on: material (40%), transport distance (30%), waste (30%)
  const materialScore = material === 'recycled' ? 100 : material === 'cotton' ? 70 : 40;
  const distanceScore = Math.max(0, 100 - (distance / 20)); // Lower distance = higher score
  const wasteScore = 100 - (wastePercent * 3);
  
  const ecoScore = Math.round(materialScore * 0.4 + distanceScore * 0.3 + wasteScore * 0.3);
  
  return {
    materialType: material,
    productWeightKg: weight,
    distanceKm: distance,
    transportMode,
    packagingType,
    materialImpact,
    transportImpact,
    packagingImpact,
    totalCarbonFootprint,
    carbonImpactLevel,
    ecoScore: Math.min(100, Math.max(0, ecoScore)),
    wastePercent,
    cValue, // Original c_value from dataset
  };
}

// Generate price
function generatePrice(productType) {
  const range = PRICE_RANGES[productType] || { min: 699, max: 1499 };
  return Math.round((Math.random() * (range.max - range.min) + range.min) / 50) * 50 - 1;
}

// Main generation
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const csvProducts = parseCSV(csvContent);

console.log(`Parsed ${csvProducts.length} products from CSV`);

// Filter products that have images (or create with placeholder)
const productsWithImages = csvProducts.filter(p => imageMap[p.prod_id]);
console.log(`${productsWithImages.length} products have matching images`);

// Generate products array
const products = [];
let id = 1;

// First add products with images
productsWithImages.forEach(csvProduct => {
  const carbon = calculateCarbon(csvProduct);
  const imageFile = imageMap[csvProduct.prod_id];
  
  products.push({
    id: id++,
    productId: csvProduct.prod_id,
    name: csvProduct.pname, // Original product name from dataset
    displayName: `${csvProduct.pname} - ${csvProduct.colour} ${csvProduct.material.charAt(0).toUpperCase() + csvProduct.material.slice(1)}`,
    category: csvProduct.category,
    price: generatePrice(csvProduct.pname),
    originalPrice: null,
    description: DESCRIPTIONS[csvProduct.pname] || `Sustainable ${csvProduct.pname.toLowerCase()} made with eco-friendly ${csvProduct.material}. Origin: ${csvProduct.countryname}.`,
    image: `/images/${imageFile}`,
    images: [`/images/${imageFile}`],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    selectedSize: csvProduct.size,
    color: csvProduct.colour,
    colors: [csvProduct.colour],
    brand: 'GreenKart Eco',
    inStock: true,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    reviews: Math.floor(Math.random() * 200) + 10,
    materialType: carbon.materialType,
    material: csvProduct.material, // Original material from dataset
    productWeightKg: carbon.productWeightKg,
    distanceKm: carbon.distanceKm,
    transportMode: carbon.transportMode,
    packagingType: carbon.packagingType,
    materialImpact: carbon.materialImpact,
    transportImpact: carbon.transportImpact,
    packagingImpact: carbon.packagingImpact,
    totalCarbonFootprint: carbon.totalCarbonFootprint, // Use c_value from CSV
    carbonFootprint: carbon.totalCarbonFootprint, // Alias for compatibility
    carbonImpactLevel: carbon.carbonImpactLevel,
    ecoScore: carbon.ecoScore,
    wastePercent: carbon.wastePercent,
    countryOfOrigin: csvProduct.countryname, // Country from dataset
    country: csvProduct.countryname, // Alias
    cValue: carbon.cValue, // Original AI model value
    sustainabilityFeatures: [
      carbon.materialType === 'recycled' ? 'Made from recycled materials' : `Made with sustainable ${carbon.materialType}`,
      carbon.carbonImpactLevel === 'Low' ? 'Low carbon footprint' : 'Reduced carbon emissions',
      carbon.packagingType === 'recycled' ? 'Eco-friendly recycled packaging' : 'Minimal packaging waste',
      `${carbon.wastePercent}% manufacturing waste`,
    ],
    tags: [
      csvProduct.pname.toLowerCase(),
      csvProduct.colour.toLowerCase(),
      csvProduct.material,
      csvProduct.category.toLowerCase(),
      csvProduct.countryname.toLowerCase(),
      'sustainable',
      'eco-friendly',
    ],
  });
});

// Add remaining products without images using placeholder images
const remainingProducts = csvProducts.filter(p => !imageMap[p.prod_id]);
const placeholderImages = Object.values(imageMap);

remainingProducts.slice(0, 200).forEach((csvProduct, index) => {
  const carbon = calculateCarbon(csvProduct);
  // Use a random existing image as placeholder
  const placeholderImage = placeholderImages[index % placeholderImages.length];
  
  products.push({
    id: id++,
    productId: csvProduct.prod_id,
    name: csvProduct.pname, // Original product name from dataset
    displayName: `${csvProduct.pname} - ${csvProduct.colour} ${csvProduct.material.charAt(0).toUpperCase() + csvProduct.material.slice(1)}`,
    category: csvProduct.category,
    price: generatePrice(csvProduct.pname),
    originalPrice: null,
    description: DESCRIPTIONS[csvProduct.pname] || `Sustainable ${csvProduct.pname.toLowerCase()} made with eco-friendly ${csvProduct.material}. Origin: ${csvProduct.countryname}.`,
    image: `/images/${placeholderImage}`,
    images: [`/images/${placeholderImage}`],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    selectedSize: csvProduct.size,
    color: csvProduct.colour,
    colors: [csvProduct.colour],
    brand: 'GreenKart Eco',
    inStock: true,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    reviews: Math.floor(Math.random() * 200) + 10,
    materialType: carbon.materialType,
    material: csvProduct.material, // Original material from dataset
    productWeightKg: carbon.productWeightKg,
    distanceKm: carbon.distanceKm,
    transportMode: carbon.transportMode,
    packagingType: carbon.packagingType,
    materialImpact: carbon.materialImpact,
    transportImpact: carbon.transportImpact,
    packagingImpact: carbon.packagingImpact,
    totalCarbonFootprint: carbon.totalCarbonFootprint, // Use c_value from CSV
    carbonFootprint: carbon.totalCarbonFootprint, // Alias for compatibility
    carbonImpactLevel: carbon.carbonImpactLevel,
    ecoScore: carbon.ecoScore,
    wastePercent: carbon.wastePercent,
    countryOfOrigin: csvProduct.countryname, // Country from dataset
    country: csvProduct.countryname, // Alias
    cValue: carbon.cValue, // Original AI model value
    sustainabilityFeatures: [
      carbon.materialType === 'recycled' ? 'Made from recycled materials' : `Made with sustainable ${carbon.materialType}`,
      carbon.carbonImpactLevel === 'Low' ? 'Low carbon footprint' : 'Reduced carbon emissions',
      carbon.packagingType === 'recycled' ? 'Eco-friendly recycled packaging' : 'Minimal packaging waste',
      `${carbon.wastePercent}% manufacturing waste`,
    ],
    tags: [
      csvProduct.pname.toLowerCase(),
      csvProduct.colour.toLowerCase(),
      csvProduct.material,
      csvProduct.category.toLowerCase(),
      csvProduct.countryname.toLowerCase(),
      'sustainable',
      'eco-friendly',
    ],
  });
});

// Generate the products.js file
const output = `/**
 * Product Data with Carbon Footprint (Generated from AI Model Dataset)
 * =====================================================================
 * 
 * This file was auto-generated from product_with_sustainability.csv
 * Contains ${products.length} products with AI-calculated sustainability scores
 * 
 * Generated on: ${new Date().toISOString()}
 */

const products = ${JSON.stringify(products, null, 2)};

module.exports = products;
`;

const outputPath = path.join(__dirname, '../data/products.js');
fs.writeFileSync(outputPath, output);

console.log(`\n✅ Generated ${products.length} products`);
console.log(`   - ${productsWithImages.length} with actual images`);
console.log(`   - ${products.length - productsWithImages.length} with placeholder images`);
console.log(`\n📁 Output: ${outputPath}`);
