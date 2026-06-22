require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const keys = require('./config/keys');
const routes = require('./routes');
const setupDB = require('./utils/db');

const { port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);


// Dynamically build CORS whitelist from environment variable if present
const defaultOrigins = [
  // Production domains
  'https://puthan-kada.vercel.app',
  'https://admin.puthan-kada.vercel.app',
  'https://puthankada.co.in',
  'https://admin.puthankada.co.in',
  'https://www.puthankada.co.in',
  'https://www.admin.puthankada.co.in',
  // Development domains (range ports 3000‑3003, 4000, 5000, 8000, 8080)
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
  'http://localhost:4000',
  'http://localhost:5000',
  'http://localhost:8000',
  'http://localhost:8080',
  // Legacy domains (backward compatibility)
  'https://admin.gracefoods.co.in',
  'https://gracefoods.co.in',
];

// ALLOWED_ORIGINS can be a comma‑separated list in .env – we merge it with defaults
let envOrigins = [];
if (process.env.ALLOWED_ORIGINS) {
  envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean);
}
const whitelist = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(
  cors({
    origin: whitelist,
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
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400 // 24 hours caching of preflight response
  })
);

// Log CORS violations for monitoring
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !whitelist.includes(origin)) {
    console.warn(`CORS violation: Origin ${origin} not in whitelist`);
  }
  next();
});
app.options('*', cors());


// Serve static assets (e.g., banner images)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Simple health check used by Vercel admin and monitoring tools
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
const startServer = async () => {
  await setupDB();
  await require('./config/passport')(app);
  app.use(routes);

  // Try to start the server and fall back to incrementing ports when no explicit port is provided.
  const desiredPort = parseInt(process.env.PORT, 10) || parseInt(port, 10) || 5000;
  const maxRetries = 5;
  const allowFallback = process.env.NODE_ENV !== 'production';

  const startListening = (portToUse) =>
    new Promise((resolve, reject) => {
      const host = process.env.HOST || '0.0.0.0';
      const srv = app.listen(portToUse, host, () => {
        const visitUrl = `http://localhost:${portToUse}/`;
        console.log(
          `${chalk.green('✓')} ${chalk.blue(`Listening on ${host}:${portToUse}. Visit ${visitUrl} in your browser.`)}`
        );
        resolve(srv);
      });

      srv.on('error', (err) => {
        reject(err);
      });
    });

  (async () => {
    let attempt = 0;
    let portToTry = desiredPort;
    while (attempt <= maxRetries) {
      try {
        const server = await startListening(portToTry);
        // Attach a generic error handler so unexpected errors are logged
        server.on('error', (err) => {
          console.error(`${chalk.red('Server error:')}`, err);
        });
        break;
      } catch (err) {
        if (err && (err.code === 'EADDRINUSE' || err.code === 'EPERM')) {
          console.error(`${chalk.red('✗')} Port ${portToTry} is unavailable (code: ${err.code}).`);
          if (!allowFallback) {
            console.error(`${chalk.red('✗')} Port is required by the environment and cannot fallback. Exiting.`);
            process.exit(1);
          }
          attempt += 1;
          portToTry += 1; // try next port
          if (attempt > maxRetries) {
            console.error(`${chalk.red('✗')} Ports ${desiredPort}..${portToTry} are unavailable. Exiting.`);
            process.exit(1);
          }
          console.log(`Trying fallback port ${portToTry} (attempt ${attempt}/${maxRetries})...`);
          // small delay before retrying
          await new Promise((r) => setTimeout(r, 250));
          continue;
        }
        // Unknown error during listen
        console.error(`${chalk.red('✗')} Failed to start server:`, err);
        process.exit(1);
      }
    }
  })();
};

startServer();
