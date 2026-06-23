const router = require('express').Router();
console.log("🔥 API INDEX LOADED");
const authRoutes = require('./auth');
const productRoutes = require('./product');
const categoryRoutes = require('./category');
const subcategoryRoutes = require('./subcategory');
const bannerRoutes = require('./banner');

router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/subcategory', subcategoryRoutes);
router.use('/banner', bannerRoutes);

module.exports = router;
