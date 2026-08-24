// The app being containerized — deliberately tiny so the Dockerfile is
// the focus of this example, not the app itself.
const express = require('express');
const { parsePort } = require('./parse-port.js');

const app = express();

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

module.exports = app;
