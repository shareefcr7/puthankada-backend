const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const CategorySchema = new mongoose.Schema({
    name: String,
    image: String
});

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [String]
});

const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);

async function checkData() {
    await mongoose.connect(MONGO_URI);
    const categories = await Category.find();
    const products = await Product.find().populate('category');
    
    console.log('Categories:', JSON.stringify(categories, null, 2));
    console.log('Products Count:', products.length);
    if (products.length > 0) {
        console.log('First 5 Products:', JSON.stringify(products.slice(0, 5), null, 2));
    }
    
    await mongoose.disconnect();
}

checkData();
