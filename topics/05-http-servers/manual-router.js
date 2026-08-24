// Exercise 1 solution: a server that responds differently based on
// method + path, with no framework — just the `url` module and a plain
// if/else router.
//
// Run: node manual-router.js
// Then try:
//   curl http://localhost:3000/
//   curl http://localhost:3000/users/42
//   curl -X POST http://localhost:3000/users
//   curl http://localhost:3000/unknown   -> 404
const http = require('node:http');

const PORT = process.env.PORT || 3000;

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const segments = pathname.split('/').filter(Boolean); // '/users/42' -> ['users', '42']

  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'welcome' }));
    return;
  }

  if (req.method === 'GET' && segments[0] === 'users' && segments[1]) {
    res.writeHead(200);
    res.end(JSON.stringify({ id: segments[1], name: 'Ada Lovelace' }));
    return;
  }

  if (req.method === 'POST' && segments[0] === 'users' && segments.length === 1) {
    res.writeHead(201);
    res.end(JSON.stringify({ message: 'user created' }));
    return;
  }

  notFound(res);
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

module.exports = server;
