// The app being containerized — deliberately tiny so the Dockerfile is
// the focus of this example, not the app itself.
const express = require('express');

const app = express();

// Deliberately duplicated (not imported) from env-config-demo's
// config.js — this app is meant to be self-contained so the Dockerfile
// alongside it can `COPY . .` and build without reaching outside this
// directory.
function parsePort(value, fallback) {
  // Unset or set-but-empty ("PORT=") both fall back to the default.
  // PORT=0 (a real convention meaning "let the OS assign a free port")
  // must NOT be treated as falsy and overridden the way a naive
  // `Number(x) || fallback` would do.
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`invalid PORT: "${value}"`);
  }
  return parsed;
}

const PORT = parsePort(process.env.PORT, 3000);

app.get('/', (req, res) => {
  res.json({ message: 'hello from inside a container' });
});

// A dedicated health check endpoint — container orchestrators (Docker,
// Kubernetes, PM2, etc.) poll this to decide if the container is
// actually serving traffic, not just "the process is running".
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptimeSeconds: process.uptime() });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    // Read back the actual bound port — with PORT=0 ("let the OS
    // assign a free port"), the OS-chosen port is only known via
    // server.address(), not the PORT const itself.
    console.log(`listening on http://localhost:${server.address().port}`);
  });
}

module.exports = app;
