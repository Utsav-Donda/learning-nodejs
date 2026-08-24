// Exercise 1 solution: a small app with 3+ routes and a custom
// request-logging middleware, demonstrating middleware order and next().
//
// Run: node middleware-demo.js
const express = require('express');

const app = express();
app.use(express.json());

// Custom middleware — runs for every request, in the order it's
// registered. Calling next() hands off to the next matching handler;
// forgetting it leaves the request hanging forever.
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
}

// A middleware that only applies to a subset of routes, mounted on a path.
function requireApiKey(req, res, next) {
  if (req.header('x-api-key') !== 'demo-key') {
    return res.status(401).json({ error: 'missing or invalid x-api-key header' });
  }
  next();
}

app.use(requestLogger);

app.get('/', (req, res) => res.json({ message: 'public route, no auth needed' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// requireApiKey only guards routes registered after this line.
app.use('/admin', requireApiKey);

app.get('/admin/stats', (req, res) => res.json({ visitors: 1234 }));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
