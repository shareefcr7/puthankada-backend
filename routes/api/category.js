const express = require('express');
const router = express.Router();
const passport = require('passport');

// Models & Utils
const Category = require('../../models/category');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const store = require('../../utils/store');
const cloudinary = require('../../config/cloudinary');
const { ROLES } = require('../../constants');

// Add Category (Admin only)
router.post('/add', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { name, description, products, isActive, subCategories, image } = req.body;
    if (!description || !name) {
      return res.status(400).json({ error: 'You must enter description & name.' });
    }
    let imageUrl = null;
    if (image && image.startsWith('data:image')) {
      const upload = await cloudinary.uploader.upload(image, { folder: 'categories' });
      imageUrl = upload.secure_url;
    }
    const category = new Category({ name, description, products, isActive, subCategories, image: imageUrl });
    const data = await category.save();
    res.status(200).json({ success: true, message: 'Category has been added successfully!', category: data });
  } catch (err) {
    console.error('❌ CATEGORY ADD ERROR:', err);
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// List active store categories
router.get('/list', async (req, res) => {
  console.log('🔥 CATEGORY LIST HIT');
  try {
    const categories = await Category.find({ isActive: true });
    console.log('✅ CATEGORY LIST SUCCESS:', categories.length);
    res.status(200).json({ categories });
  } catch (error) {
    console.error('❌ CATEGORY LIST ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all categories (admin)
router.get('/', async (req, res) => {
  console.log('🔥 CATEGORY ROOT HIT');
  try {
    console.log('🔥 BEFORE FIND');
    const categories = await Category.find({});
    console.log('✅ AFTER FIND:', categories.length);
    res.status(200).json({ categories });
  } catch (error) {
    console.error('❌ CATEGORY ROOT ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single category by id
router.get('/:id', async (req, res) => {
  console.log('🔥 CATEGORY DETAIL HIT, id:', req.params.id);
  try {
    const categoryDoc = await Category.findOne({ _id: req.params.id }).populate({ path: 'products', select: 'name' });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'No Category found.' });
    }
    res.status(200).json({ category: categoryDoc });
  } catch (error) {
    console.error('❌ CATEGORY DETAIL ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update category (Admin only)
router.put('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const update = req.body.category;
    // Upload new image if base64 provided
    if (update.image && update.image.startsWith('data:image')) {
      const upload = await cloudinary.uploader.upload(update.image, { folder: 'categories' });
      update.image = upload.secure_url;
    }
    const { slug } = update;
    const foundCategory = await Category.findOne({ slug });
    if (foundCategory && foundCategory._id != categoryId) {
      return res.status(400).json({ error: 'Slug is already in use.' });
    }
    await Category.findByIdAndUpdate(categoryId, update, { new: true });
    res.status(200).json({ success: true, message: 'Category has been updated successfully!' });
  } catch (error) {
    console.error('❌ CATEGORY UPDATE ERROR:', error);
    res.status(400).json({ error: 'Your request could not be processed.' });
  }
});

// Activate/deactivate category (Admin only)
router.put('/:id/active', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const update = req.body.category;
    const query = { _id: categoryId };
    if (!update.isActive) {
      const categoryDoc = await Category.findOne({ _id: categoryId, isActive: true }, 'products -_id').populate('products');
      store.disableProducts(categoryDoc.products);
    }
    await Category.findOneAndUpdate(query, update, { new: true });
    res.status(200).json({ success: true, message: 'Category has been updated successfully!' });
  } catch (error) {
    console.error('❌ CATEGORY ACTIVE UPDATE ERROR:', error);
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// Delete category (Admin only)
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const result = await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Category has been deleted successfully!', result });
  } catch (error) {
    console.error('❌ CATEGORY DELETE ERROR:', error);
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

module.exports = router;
const router = express.Router();
console.log('✅ category.js loaded');
const passport = require('passport');

// Bring in Models & Utils
const Category = require('../../models/category');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const store = require('../../utils/store');
const cloudinary = require('../../config/cloudinary');
const { ROLES } = require('../../constants');

// router.post('/add', auth, role.check(ROLES.Admin), (req, res) => {
//   const name = req.body.name;
//   const description = req.body.description;
//   const products = req.body.products;
//   const isActive = req.body.isActive;

//   if (!description || !name) {
//     return res
//       .status(400)
//       .json({ error: 'You must enter description & name.' });
//   }

//   const category = new Category({
//     name,
//     description,
//     products,
//     isActive
//   });

//   category.save((err, data) => {
//     if (err) {
//       return res.status(400).json({
//         error: 'Your request could not be processed. Please try again.'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Category has been added successfully!`,
//       category: data
//     });
//   });
// });
router.post('/add', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { name, description, products, isActive, subCategories, image } = req.body;

    if (!description || !name) {
      return res.status(400).json({ error: 'You must enter description & name.' });
    }

    let imageUrl = null;
    if (image && image.startsWith('data:image')) {
      const upload = await cloudinary.uploader.upload(image, { folder: 'categories' });
      imageUrl = upload.secure_url;
    }

    const category = new Category({
      name,
      description,
      products,
      isActive,
      subCategories,
      image: imageUrl,
    });

    const data = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category has been added successfully!',
      category: data
    });

  } catch (err) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// fetch store categories api
router.get('/list', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({
      categories
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch categories api
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      categories
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch category api
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const categoryDoc = await Category.findOne({ _id: categoryId }).populate({
      path: 'products',
      select: 'name'
    });

    if (!categoryDoc) {
      return res.status(404).json({
        message: 'No Category found.'
      });
    }

    res.status(200).json({
      category: categoryDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// router.put('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const update = req.body.category;
//     const query = { _id: categoryId };
//     const { slug } = req.body.category;

//     const foundCategory = await Category.findOne({
//       $or: [{ slug }]
//     });

//     if (foundCategory && foundCategory._id != categoryId) {
//       return res.status(400).json({ error: 'Slug is already in use.' });
//     }

//     await Category.findOneAndUpdate(query, update, {
//       new: true
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Category has been updated successfully!'
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: 'Your request could not be processed. Please try again.'
//     });
//   }
// });
router.put('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const update = req.body.category;

    // Upload new image if base64 provided
    if (update.image && update.image.startsWith('data:image')) {
      const upload = await cloudinary.uploader.upload(update.image, { folder: 'categories' });
      update.image = upload.secure_url;
    }

    const { slug } = update;
    const foundCategory = await Category.findOne({ slug });
    if (foundCategory && foundCategory._id != categoryId) {
      return res.status(400).json({ error: 'Slug is already in use.' });
    }

    await Category.findByIdAndUpdate(categoryId, update, { new: true });

    res.status(200).json({
      success: true,
      message: 'Category has been updated successfully!'
    });

  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed.' });
  }
});
router.put('/:id/active', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const update = req.body.category;
    const query = { _id: categoryId };

    // disable category(categoryId) products
    if (!update.isActive) {
      const categoryDoc = await Category.findOne(
        { _id: categoryId, isActive: true },
        'products -_id'
      ).populate('products');

      store.disableProducts(categoryDoc.products);
    }

    await Category.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: 'Category has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete(
  '/delete/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const product = await Category.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: `Category has been deleted successfully!`,
        product
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;
