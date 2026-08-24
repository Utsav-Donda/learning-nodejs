// A deliberately slow, synchronous, CPU-bound function — the kind of
// work that would freeze an HTTP server's event loop if run inline.
// Shared by worker-threads-demo.js and profiling-target.js, both in
// this same topic-14 directory (unlike topic 13's per-demo-folder
// duplication, there's no build-context constraint here forcing
// separate copies).
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

module.exports = { fibonacci };
