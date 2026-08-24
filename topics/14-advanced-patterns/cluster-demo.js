// Uses the built-in cluster module to fork one worker process per CPU
// core, all sharing port 3000 — the OS/Node load-balances incoming
// connections across them, so a CPU-bound request on one worker
// doesn't block requests being handled by the others.
//
// Run: node cluster-demo.js
// Then, in another terminal, hit it a few times and watch different
// worker PIDs answer:
//   for i in 1 2 3 4; do curl http://localhost:3000; echo; done
// Stop with Ctrl+C.
//
// Note: cluster's round-robin scheduling (cluster.SCHED_RR) is the
// default on every platform EXCEPT Windows, where the OS itself
// distributes connections instead (cluster.SCHED_NONE) — this can
// result in one worker handling most/all requests in a short-lived
// test like the one above, which is expected Windows behavior, not a
// bug in this demo.
const cluster = require('node:cluster');
const http = require('node:http');
const os = require('node:os');

const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  const numWorkers = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
  console.log(`primary ${process.pid} starting ${numWorkers} workers`);

  // Distinguishes "a worker died unexpectedly, replace it" from "we're
  // intentionally shutting everything down" — without this flag, each
  // worker.kill() call below during shutdown would itself trigger the
  // 'exit' handler, which would fork a brand new replacement worker in
  // the middle of shutting down, racing the shutdown itself.
  let shuttingDown = false;

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died (code ${code}, signal ${signal})`);
    if (shuttingDown) return;
    console.log('  restarting it');
    // A crashed worker doesn't take the whole service down — the
    // primary just replaces it, matching the same resilience idea
    // PM2's autorestart provides at the process level (topic 13).
    cluster.fork();
  });

  function shutdown() {
    console.log('\nprimary shutting down all workers');
    shuttingDown = true;
    for (const worker of Object.values(cluster.workers)) worker.kill();
    process.exit(0);
  }

  // SIGINT: Ctrl+C in an interactive terminal. SIGTERM: what process
  // managers/orchestrators send (see topic 13's graceful shutdown —
  // PM2, Docker, Kubernetes all default to SIGTERM). Note: Windows
  // doesn't support POSIX signals the way Linux/macOS do — Node/libuv
  // emulates SIGINT there (so Ctrl+C works), but SIGTERM isn't
  // reliably delivered on Windows at all. This handler is still worth
  // having for the Linux/macOS/container environments almost all real
  // deployments run on; on Windows, stop this demo with Ctrl+C.
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} else {
  // This branch runs once per forked worker process.
  const server = http.createServer((req, res) => {
    if (req.url === '/crash') {
      // Demonstrates that killing one worker doesn't take the others
      // (or the server as a whole) down with it.
      process.exit(1);
    }
    res.end(`handled by worker ${process.pid}\n`);
  });

  server.listen(PORT);
  console.log(`worker ${process.pid} listening`);
}
