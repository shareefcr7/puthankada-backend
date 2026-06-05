require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');

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
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use(
  cors({
    origin: [
  'https://puthankada-frontend.vercel.app',
  'https://puthankada-admin.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002'
],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.options('*', cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);

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
