// A tiny server that reads all its configuration through config.js
// instead of touching process.env directly — demonstrates fail-fast
// startup validation (missing API_KEY crashes immediately with a clear
// message, rather than failing mysteriously on the first request that
// needs it).
//
// Run: cp .env.example .env   (then edit .env if you want a real API_KEY)
//      node server.js
// Or without a .env file at all: NODE_ENV=test node server.js
const http = require('node:http');
const config = require('./config.js');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    message: 'server is running',
    environment: config.nodeEnv,
    // Never echo the real API key back in a response — this redacts it
    // to prove config loaded without leaking the secret.
    apiKeyLoaded: Boolean(config.apiKey),
  }));
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(`listening on http://localhost:${config.port} (env: ${config.nodeEnv})`);
  });
}

module.exports = server;
