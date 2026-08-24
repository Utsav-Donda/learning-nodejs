// The smallest possible HTTP server using only Node's built-in http module.
//
// Run: node hello-server.js
// Then: curl http://localhost:3000
const http = require('node:http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from a raw Node.js HTTP server!\n');
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

module.exports = server;
