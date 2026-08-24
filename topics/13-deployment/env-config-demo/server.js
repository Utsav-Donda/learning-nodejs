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
  // Never echo the real API key back in a response. There's also no
  // "apiKeyLoaded" field to report here — config.js's requireEnv()
  // already throws at startup if it's missing, so by the time a
  // request reaches this handler it's guaranteed to be set; getting
  // any response at all is the proof that it loaded.
  res.end(JSON.stringify({
    message: 'server is running',
    environment: config.nodeEnv,
  }));
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(`listening on http://localhost:${config.port} (env: ${config.nodeEnv})`);
  });
}

module.exports = server;
