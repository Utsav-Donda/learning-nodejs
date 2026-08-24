// A small HTTP server with a deliberately expensive route, to have
// something concrete to point a profiler at — see profiling-cheatsheet.md.
//
// Run: node profiling-target.js
// Every request runs the same CPU-bound calculation (no routing — any
// path works). Hit it a few times to generate profiling data:
//   for i in $(seq 1 5); do curl "http://localhost:3000/?n=32"; done
const http = require('node:http');

const PORT = process.env.PORT || 3000;

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const server = http.createServer((req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const raw = searchParams.get('n');
  // `Number(raw) || 30` would incorrectly treat ?n=0 as "not provided"
  // and silently substitute 30, since 0 is falsy — the same class of
  // bug topic 13 hit repeatedly with PORT=0. Parse explicitly instead.
  const parsed = raw === null ? NaN : Number(raw);
  const n = Number.isInteger(parsed) && parsed >= 0 ? parsed : 30;

  const start = Date.now();
  const result = fibonacci(n);
  const durationMs = Date.now() - start;

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ n, result, durationMs }));
});

server.listen(PORT, () => {
  console.log(`[pid ${process.pid}] listening on http://localhost:${PORT}`);
  console.log(`try: curl "http://localhost:${PORT}/?n=35"`);
});

module.exports = server;
