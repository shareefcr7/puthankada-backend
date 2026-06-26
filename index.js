require('dotenv').config();

const express = require('express');

const setupDB = require('./utils/db');

setupDB();

// Import CORS utilities
const {
  corsMiddleware,
  corsErrorHandler
} = require('./middleware/cors');

const app = express();

// -----------------------------------------------------------
// Middleware
// -----------------------------------------------------------
// Apply CORS globally first (must be before body parsers to avoid CORS errors on payload/syntax errors)
app.use(corsMiddleware);
app.options('*', corsMiddleware);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// -----------------------------------------------------------
// Routes
// -----------------------------------------------------------
app.get('/', (req, res) => {
  res.send('🚀 Puthan-Kada Backend Running');
});


//console.log(require('./routes'));
// API Routes
app.use('/api', require('./routes'));
app.get("/api", (req, res) => {
  res.json({ ok: true, message: "Puthankada API is running" });
});
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Puthankada backend healthy" });
});

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