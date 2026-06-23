// fetch store categories api
router.get('/list', async (req, res) => {
  console.log('🔥 CATEGORY LIST HIT');

  try {
    const categories = await Category.find({ isActive: true });

    console.log('✅ CATEGORY LIST SUCCESS:', categories.length);

    res.status(200).json({
      categories
    });
  } catch (error) {
    console.log('❌ CATEGORY LIST ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
});

// fetch categories api
router.get('/', async (req, res) => {
  console.log('🔥 CATEGORY ROOT HIT');

  try {
    console.log('🔥 BEFORE FIND');

    const categories = await Category.find({});

    console.log('✅ AFTER FIND:', categories.length);

    res.status(200).json({
      categories
    });
  } catch (error) {
    console.log('❌ CATEGORY ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
});