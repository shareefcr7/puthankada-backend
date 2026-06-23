
const router = require('express').Router();

require('dotenv').config();

console.log("🚀 NEW BUILD 4c27374 LOADED");

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Puthan-Kada API Running'
    });
});

router.use('/auth', require('./api/auth'));
router.use('/banner', require('./api/banner'));
router.use('/category', require('./api/category'));
router.use('/product', require('./api/product'));
router.use('/subcategory', require('./api/subcategory'));
router.use('/user', require('./api/user'));

module.exports = router;