// The app being containerized — deliberately tiny so the Dockerfile is
// the focus of this example, not the app itself.
const express = require('express');

const app = express();
// process.env.PORT || 3000 would incorrectly override PORT=0 (a real
// convention meaning "let the OS assign a free port") since "0" is
// truthy as a string but 0 is falsy as a number — checking for
// undefined instead handles that correctly.
const PORT = process.env.PORT !== undefined ? Number(process.env.PORT) : 3000;

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
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
