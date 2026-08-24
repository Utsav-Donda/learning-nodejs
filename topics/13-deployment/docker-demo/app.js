// The app being containerized — deliberately tiny so the Dockerfile is
// the focus of this example, not the app itself.
const express = require('express');

const app = express();

// Deliberately duplicated (not imported) from
// env-config-demo/parse-port.js — this app is meant to be
// self-contained so the Dockerfile alongside it can `COPY . .` and
// build without reaching outside this directory (unlike pm2-demo,
// which isn't build-context-constrained and does import the shared
// helper).
function parsePort(value, fallback) {
  // Unset or set-but-empty/whitespace-only ("PORT=" or "PORT= ") both
  // fall back to the default. Number('') and Number(' ') both evaluate
  // to 0, so an empty/blank value can't be allowed to fall through to
  // Number() or it would be indistinguishable from an intentional 0.
  if (value === undefined || value.trim() === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`invalid PORT: "${value}"`);
  }

  // Unlike bare-metal/PM2 deployments, PORT=0 ("let the OS pick a free
  // port") doesn't make sense for a container: EXPOSE, HEALTHCHECK,
  // and `docker run -p` all need a fixed port known ahead of time, not
  // one discovered after the app starts. Rejecting it here — instead
  // of just documenting it in the Dockerfile — means a misconfigured
  // `docker run -e PORT=0` fails immediately with a clear message
  // instead of silently producing an unreachable, unhealthy container.
  if (parsed === 0) {
    throw new Error('PORT=0 is not supported in the containerized app — set a fixed port instead');
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
  // No need to read back server.address().port here the way
  // pm2-demo/env-config-demo do — parsePort() above already rejects
  // PORT=0, so PORT is guaranteed to equal whatever port was actually
  // bound by the time this callback runs.
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

// Exposes parsePort so it can be unit-tested (see parse-port.test.js)
// without changing what `require('./app.js')` returns for normal use
// — it's still the Express app itself, just with one extra property.
app.parsePort = parsePort;

module.exports = app;
