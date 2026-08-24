// A small HTTP server with a deliberately expensive route, to have
// something concrete to point a profiler at — see profiling-cheatsheet.md.
//
// Run: node profiling-target.js
// Every request runs the same CPU-bound calculation (no routing — any
// path works). Hit it a few times to generate profiling data:
//   for i in $(seq 1 5); do curl "http://localhost:3000/?n=32"; done
const http = require('node:http');
const { fibonacci } = require('./fibonacci.js');

// process.env.PORT || 3000 would incorrectly override PORT=0 (a real
// convention meaning "let the OS assign a free port") since "0" is
// truthy as a string but 0 is falsy as a number — the same class of
// bug this file's own ?n= parsing below is careful to avoid.
const PORT = process.env.PORT !== undefined ? Number(process.env.PORT) : 3000;

// Caps how expensive a single request can be — fib(N) grows
// exponentially, so an unbounded ?n= would let any client monopolize
// this single-threaded server's event loop for as long as they like
// (a trivial DoS). 40 is already several seconds; that's plenty for
// generating profiler data without letting a request run indefinitely.
const MAX_N = 40;

const server = http.createServer((req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const raw = searchParams.get('n');
  // `Number(raw) || 30` would incorrectly treat ?n=0 as "not provided"
  // and silently substitute 30, since 0 is falsy — the same class of
  // bug topic 13 hit repeatedly with PORT=0. Parse explicitly instead.
  const parsed = raw === null ? NaN : Number(raw);
  const n = Number.isInteger(parsed) && parsed >= 0 && parsed <= MAX_N ? parsed : 30;

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
