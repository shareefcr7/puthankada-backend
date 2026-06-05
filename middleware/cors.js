const cors = require('cors');

// Get allowed origins from environment or use defaults
const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  const defaultOrigins = [
    // Production domains
    'https://puthan-kada.vercel.app',
    'https://admin.puthan-kada.vercel.app',
    'https://puthankada.co.in',
    'https://admin.puthankada.co.in',
    'https://www.puthankada.co.in',
    'https://www.admin.puthankada.co.in',
    
    // Development domains
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003',
    
    // Additional local development variations
    'http://localhost:4000',
    'http://localhost:5000',
    'http://localhost:8000',
    'http://localhost:8080',
    
    // Legacy domains (for backward compatibility)
    'https://admin.gracefoods.co.in',
    'https://gracefoods.co.in'
  ];

  if (envOrigins) {
    const envOriginsList = envOrigins.split(',').map(origin => origin.trim());
    return [...new Set([...defaultOrigins, ...envOriginsList])];
  }

  return defaultOrigins;
};

// CORS configuration with comprehensive origin support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = getAllowedOrigins();
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS blocked origin: ${origin}`);
      console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'Pragma',
    'X-HTTP-Method-Override',
    'X-Forwarded-For',
    'X-Real-IP'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  maxAge: 86400 // 24 hours cache for preflight requests
};

// Enhanced preflight OPTIONS handler
const preflightHandler = (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma, X-HTTP-Method-Override, X-Forwarded-For, X-Real-IP');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
};

// CORS error handler middleware
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS policy') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed by CORS policy',
      origin: req.headers.origin || 'Unknown'
    });
  }
  next(err);
};

module.exports = {
  corsOptions,
  preflightHandler,
  corsErrorHandler,
  corsMiddleware: cors(corsOptions)
};