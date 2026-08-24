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
const { parsePort } = require('./parse-port.js');

const PORT = parsePort(process.env.PORT, 3000);

if (cluster.isPrimary) {
  const numWorkers = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
  console.log(`primary ${process.pid} starting ${numWorkers} workers`);

  // Distinguishes "a worker died unexpectedly, replace it" from "we're
  // intentionally shutting everything down" — without this flag, a
  // worker exiting as part of the coordinated shutdown below would
  // otherwise trigger this handler to fork a brand new replacement in
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

  function shutdown(signal) {
    if (shuttingDown) return; // ignore a second Ctrl+C while already shutting down
    shuttingDown = true;
    console.log(`\nprimary received ${signal}, telling all workers to shut down gracefully...`);

    const workers = Object.values(cluster.workers);
    let remaining = workers.length;

    if (remaining === 0) {
      process.exit(0);
      return;
    }

    for (const worker of workers) {
      // worker.kill() just sends a signal and returns immediately — it
      // does NOT wait for the worker to actually finish, so calling
      // process.exit() right after it (as an earlier version of this
      // file did) could terminate the primary before any worker had
      // drained its in-flight requests or even received the signal.
      // Instead, ask each worker to shut down via an IPC message (see
      // the worker branch below) and wait for cluster's own 'exit'
      // event — which only fires once a worker process has genuinely
      // terminated — before the primary exits itself.
      worker.once('exit', () => {
        remaining -= 1;
        if (remaining === 0) {
          console.log('all workers exited, primary shutting down');
          process.exit(0);
        }
      });

      // A worker can have already disconnected on its own by this
      // point — e.g. it received SIGINT directly via POSIX process-
      // group signal delivery (see the worker branch below) and
      // finished draining before this loop reached it. Calling
      // worker.send() on an already-disconnected worker emits an
      // unhandled 'error' event, which crashes the primary — checking
      // first avoids that; the 'exit' listener above still fires
      // either way once the worker is actually gone.
      if (worker.isConnected()) {
        worker.send('shutdown');
      }
    }

    // Safety net: if a worker hangs (e.g. a request that never
    // resolves) and never reaches its own exit, force everything
    // closed rather than hanging forever.
    const forceExitTimer = setTimeout(() => {
      console.error('workers did not exit in time — forcing shutdown');
      for (const worker of Object.values(cluster.workers)) worker.kill();
      process.exit(1);
    }, 10_000);
    forceExitTimer.unref();
  }

  // SIGINT: Ctrl+C in an interactive terminal. SIGTERM: what process
  // managers/orchestrators send (see topic 13's env-config-demo/
  // pm2-demo notes on PM2/Docker/Kubernetes defaulting to SIGTERM).
  // Note: Windows doesn't support POSIX signals the way Linux/macOS
  // do — Node/libuv emulates SIGINT there (so Ctrl+C works), but
  // SIGTERM isn't reliably delivered on Windows at all. This handler
  // is still worth having for the Linux/macOS/container environments
  // almost all real deployments run on; on Windows, stop this demo
  // with Ctrl+C.
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
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

  let workerShuttingDown = false;
  function drainAndExit() {
    if (workerShuttingDown) return;
    workerShuttingDown = true;
    // Stops accepting new connections but waits for in-flight requests
    // on THIS worker to finish before exiting — the same pattern
    // graceful-shutdown-demo.js uses for a single, non-clustered server.
    server.close(() => process.exit(0));
  }

  // Two independent paths can trigger a graceful drain here: the IPC
  // message the primary's shutdown() sends above, or a signal
  // delivered directly to this worker — on POSIX, Ctrl+C sends SIGINT
  // to the whole foreground process group (primary AND every worker)
  // at once, so a worker can receive it independently of whatever the
  // primary is doing. Both paths drain the same way; the flag above
  // ensures only the first one to fire actually runs.
  process.on('message', (msg) => {
    if (msg === 'shutdown') drainAndExit();
  });
  process.on('SIGINT', drainAndExit);
  process.on('SIGTERM', drainAndExit);
}
