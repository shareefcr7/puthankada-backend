require('dotenv').config();

const express = require('express');

// Import CORS utilities
const {
  corsMiddleware,
  corsErrorHandler
} = require('./middleware/cors');

const app = express();

// -----------------------------------------------------------
// Middleware
// -----------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS globally
app.use(corsMiddleware);

// Handle OPTIONS requests
app.options('*', corsMiddleware);

// -----------------------------------------------------------
// Routes
// -----------------------------------------------------------
app.get('/', (req, res) => {
  res.send('🚀 Puthan-Kada Backend Running');
});


//console.log(require('./routes'));
// API Routes
//app.use('/api', require('./routes'));

// -----------------------------------------------------------
// Error Handling
// -----------------------------------------------------------
app.use(corsErrorHandler);

// -----------------------------------------------------------
// Start Server
// -----------------------------------------------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;