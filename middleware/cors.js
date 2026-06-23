const cors = require('cors');

console.log('================================');
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);
console.log('================================');

// Get allowed origins from environment or use defaults
const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS;

  const defaultOrigins = [
    'https://puthan-kada.vercel.app',
    'https://admin.puthan-kada.vercel.app',
    'https://puthankadaonline.in',
    'https://www.puthankadaonline.in',
    'https://admin.puthankadaonline.in',

    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ];

  if (envOrigins) {
    const envOriginsList = envOrigins
      .split(',')
      .map(origin => origin.trim());

    return [...new Set([...defaultOrigins, ...envOriginsList])];
  }

  return defaultOrigins;
};

const corsOptions = {
  origin: function (origin, callback) {

    console.log('Incoming Origin:', origin);

    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = getAllowedOrigins();

    if (allowedOrigins.includes(origin)) {
      console.log('✅ Allowed Origin:', origin);
      return callback(null, true);
    }

    console.log('🚫 CORS blocked origin:', origin);
    console.log('📋 Allowed origins:', allowedOrigins);

    return callback(new Error('Not allowed by CORS policy'));
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
};

const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS policy') {
    return res.status(403).json({
      error: 'CORS Error',
      origin: req.headers.origin
    });
  }
  next(err);
};

module.exports = {
  corsOptions,
  corsErrorHandler,
  corsMiddleware: cors(corsOptions)
};