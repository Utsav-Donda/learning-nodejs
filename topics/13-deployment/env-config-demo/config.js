// Centralizes environment-variable reading in one place: validated once
// at startup, with defaults, instead of process.env.WHATEVER scattered
// across the codebase (which makes typos silently become `undefined`).
const path = require('node:path');
const { parsePort } = require('./parse-port.js');

// Node 20.6+ can load a .env file natively — no `dotenv` package needed.
// In production, env vars are normally injected by the host/container
// platform directly, so loading a .env file is optional and only makes
// sense in local development. This repo's declared floor is Node
// >=18.0.0 (package.json), where process.loadEnvFile doesn't exist at
// all — guard for that first, since calling a missing function throws
// a plain TypeError with no .code property, which the ENOENT check
// below would otherwise rethrow and crash the module on older Node
// even when there's simply no .env file to load.
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(path.join(__dirname, '.env'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}
// On Node <20.6, .env loading is silently skipped — env vars must be
// exported in the shell instead (export API_KEY=... / set on Windows).

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  port: parsePort(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  // Only enforce API_KEY outside tests, so the demo app can still boot
  // for exercises/tests without every contributor needing a real key.
  apiKey: process.env.NODE_ENV === 'test' ? 'test-key' : requireEnv('API_KEY'),
};

module.exports = config;
