const router = require('express').Router();

const apiRoutes = require('./api');

// Root route to show API is running (prevents "Cannot GET /" in browser)
router.get('/', (req, res) => res.send('Puthan-Kada backend is running. Visit /api for endpoints'));

router.use('/api', apiRoutes);

module.exports = router;
