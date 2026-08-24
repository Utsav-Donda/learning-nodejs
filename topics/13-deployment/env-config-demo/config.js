// Centralizes environment-variable reading in one place: validated once
// at startup, with defaults, instead of process.env.WHATEVER scattered
// across the codebase (which makes typos silently become `undefined`).
const path = require('node:path');

// Node 20.6+ can load a .env file natively — no `dotenv` package needed.
// In production, env vars are normally injected by the host/container
// platform directly, so loading a .env file is optional and only makes
// sense in local development. Catching the "file doesn't exist" error
// avoids a separate fs.existsSync() call before every startup.
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing required environment variable: ${name}`);
  }
  return value;
}

function parsePort(value, fallback) {
  // Unset (undefined) OR set-but-empty ("PORT=" with no value) both
  // fall back to the default. PORT=0 (a real convention meaning "let
  // the OS pick a free port") must NOT be treated the same way and
  // overridden, the way the naive `Number(x) || fallback` would do —
  // which is also why an empty string can't just fall through to
  // Number(''), since that evaluates to 0 and would be indistinguishable
  // from an intentional PORT=0.
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`invalid PORT: "${value}"`);
  }
  return parsed;
}

const config = {
  port: parsePort(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  // Only enforce API_KEY outside tests, so the demo app can still boot
  // for exercises/tests without every contributor needing a real key.
  apiKey: process.env.NODE_ENV === 'test' ? 'test-key' : requireEnv('API_KEY'),
};

module.exports = config;
