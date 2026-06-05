const mongoose = require('mongoose');
require('dotenv').config();

const Banner = require('./models/banner');
const Category = require('./models/category');
const Product = require('./models/product');
const SubCategory = require('./models/subcategory');
const User = require('./models/user');

const MONGO_URI = process.env.MONGO_URI;

const cleanupDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for cleanup...');

    // Remove old Gracio-related data
    console.log('Cleaning up old Gracio data...');
    
    // Clear all existing banners
    await Banner.deleteMany({});
    console.log('✅ Cleared old banners');

    // Clear all existing categories and subcategories
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    console.log('✅ Cleared old categories and subcategories');

    // Clear all existing products
    await Product.deleteMany({});
    console.log('✅ Cleared old products');

    // Remove old admin accounts (except Puthankada admin)
    await User.deleteMany({ email: { $ne: 'admin@puthankada.com' } });
    console.log('✅ Cleared old user accounts');

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: node createAdmin.js to create Puthankada admin');
    console.log('2. Replace logo images in both frontend and admin projects');
    console.log('3. Add new hardware-related categories and products');

    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
};

console.log('🧹 Starting database cleanup for Puthankada rebranding...');
console.log('This will remove all Gracio-related data.');
console.log('');

cleanupDatabase();