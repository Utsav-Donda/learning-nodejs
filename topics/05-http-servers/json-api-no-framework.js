// Exercise 2 solution: manually parse a JSON request body (requests
// arrive as a stream of Buffer chunks — there's no req.body without a
// framework) and echo it back.
//
// Run: node json-api-no-framework.js
// Then: curl -X POST http://localhost:3000/echo -H "Content-Type: application/json" -d '{"hello":"world"}'
const http = require('node:http');

const PORT = process.env.PORT || 3000;

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST' && req.url === '/echo') {
    try {
      const body = await readJsonBody(req);
      res.writeHead(200);
      res.end(JSON.stringify({ youSent: body }));
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

module.exports = server;
