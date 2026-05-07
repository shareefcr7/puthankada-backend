const mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv').config();

const Product = require('../models/product');
const Category = require('../models/category');
const setupDB = require('./db');

const categoriesData = [
  {
    name: 'Smoked Meat Products',
    description: 'Traditional Kerala style smoked and dried meat delicacies.',
    image: '/images/categories/cat_meat_products.png'
  },
  {
    name: 'Gourmet Pickles',
    description: 'Home-made spicy and savory pickles with authentic flavors.',
    image: '/images/categories/cat_pickles.png'
  },
  {
    name: 'Kids Nutrition',
    description: 'Pure and natural supplements for your little ones.',
    image: '/images/categories/cat_kids_nutrition.png'
  },
  {
    name: 'Natural Honey',
    description: '100% pure and unprocessed honey from the wild.',
    image: '/images/categories/cat_honey.png'
  },
  {
    name: 'Spice Collections',
    description: 'Premium quality whole and powdered spices.',
    image: '/images/categories/cat_spices.png'
  },
  {
    name: 'Gift Collections',
    description: 'Specially curated boxes for every occasion.',
    image: '/images/categories/cat_gift_boxes.png'
  }
];

const productsData = [
  {
    name: 'Home made Ready to eat Idiyirachi(Smoky Flavour)',
    description: 'Traditional Kerala shredded dried beef with a rich smoky flavor, ready to eat.',
    price: 450,
    categoryName: 'Smoked Meat Products',
    image: '/images/products/idiyirachi_smoky.png'
  },
  {
    name: 'Home made Ready to Cook Dried beef((Smoky Flavour)',
    description: 'Authentic dried beef slices, perfectly seasoned and smoked, ready to cook.',
    price: 400,
    categoryName: 'Smoked Meat Products',
    image: '/images/products/dried_beef_smoky.png'
  },
  {
    name: 'Pickle Fish',
    description: 'Spicy and tangy fish pickle made with fresh catch and traditional spices.',
    price: 350,
    categoryName: 'Gourmet Pickles',
    image: '/images/products/pickle_fish.png'
  },
  {
    name: 'Pickle Beef',
    description: 'Savory beef pickle with a burst of Kerala spices and slow-cooked meat.',
    price: 380,
    categoryName: 'Gourmet Pickles',
    image: '/images/products/pickle_beef.png'
  },
  {
    name: 'Kannan Kaya powder(For Kids)',
    description: 'Highly nutritious raw banana powder, perfect for baby food and growing kids.',
    price: 250,
    categoryName: 'Kids Nutrition',
    image: '/images/products/kannan_kaya_powder.png'
  },
  {
    name: 'Big Honey',
    description: 'Large jar of premium, pure natural honey collected from forest hives.',
    price: 600,
    categoryName: 'Natural Honey',
    image: '/images/products/big_honey.png'
  },
  {
    name: 'Spices Gift Box',
    description: 'An elegant gift box containing a variety of premium Indian spices.',
    price: 1200,
    categoryName: 'Gift Collections',
    image: '/images/products/spices_gift_box.png'
  }
];

const seedPremium = async () => {
  try {
    console.log(`${chalk.blue('✓')} ${chalk.blue('Premium seeding started...')}`);

    // DELETE existing products and categories as requested ("currntly imges dlt")
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log(`${chalk.yellow('!')} ${chalk.yellow('Existing products and categories cleared.')}`);

    const createdCategories = {};

    for (const cat of categoriesData) {
      const category = new Category({
        name: cat.name,
        description: cat.description,
        image: cat.image,
        isActive: true
      });
      await category.save();
      console.log(`${chalk.green('✓')} ${chalk.green(`Category ${cat.name} created.`)}`);
      createdCategories[cat.name] = category._id;
    }

    for (const prod of productsData) {
      const categoryId = createdCategories[prod.categoryName];

      const defaultVariant = {
        color: 'Standard',
        price: prod.price,
        stock: 100,
        images: [prod.image],
        isDefault: true
      };

      const product = new Product({
        name: prod.name,
        description: prod.description,
        isActive: true,
        category: categoryId,
        variants: [defaultVariant]
      });
      
      const saved = await product.save();
      
      // Associate with category
      await Category.updateOne({ _id: categoryId }, { $push: { products: saved._id } });
      
      console.log(`${chalk.green('✓')} ${chalk.green(`Product ${prod.name} created.`)}`);
    }

    console.log(`${chalk.green('✓')} ${chalk.green('Premium products and categories seeded successfully!')}`);
  } catch (error) {
    console.error(`${chalk.red('x')} ${chalk.red('Error during seeding:')}`, error);
  } finally {
    await mongoose.connection.close();
    console.log(`${chalk.blue('✓')} ${chalk.blue('Database connection closed.')}`);
  }
};

(async () => {
  await setupDB();
  await seedPremium();
})();
