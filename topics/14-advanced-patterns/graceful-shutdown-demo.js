// Demonstrates graceful shutdown: on SIGINT/SIGTERM, stop accepting
// new connections, let in-flight requests finish, then exit — instead
// of killing the process mid-request and cutting clients off.
//
// Run: node graceful-shutdown-demo.js
// Then, while a slow request is in flight, stop the server with
// Ctrl+C and watch it wait for that request to finish first:
//   curl http://localhost:3000/slow &
//   (immediately) Ctrl+C in the server's terminal
const http = require('node:http');
const { parsePort } = require('./parse-port.js');

const PORT = parsePort(process.env.PORT, 3000);

const server = http.createServer((req, res) => {
  if (req.url === '/slow') {
    // Simulates a request that takes a while — e.g. a slow DB query —
    // to make the shutdown delay visible.
    setTimeout(() => {
      res.end('slow response finished\n');
    }, 3000);
    return;
  }
  res.end('ok\n');
});

server.listen(PORT, () => {
  console.log(`[pid ${process.pid}] listening on http://localhost:${PORT}`);
});

// Without this, a bind failure (e.g. the port is already in use by
// another running demo) crashes the process with a raw, confusing
// stack trace instead of a clear message. Uses process.exit() rather
// than just setting process.exitCode — this file also registers
// SIGINT/SIGTERM listeners, and while a bind failure specifically
// doesn't leave anything else keeping the event loop alive today, an
// explicit exit() is the safer default to copy for any future demo
// that might (matching cluster-demo.js's approach).
server.on('error', (err) => {
  console.error('server error:', err.message);
  process.exit(1);
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return; // a second Ctrl+C shouldn't restart this logic
  shuttingDown = true;
  console.log(`\nreceived ${signal}, shutting down gracefully...`);

  // Stops the server from accepting new connections, but — unlike just
  // killing the process — waits for requests already in progress to
  // finish before its callback fires.
  // Safety net: if something hangs (a request that never resolves, a
  // stuck DB connection) and server.close()'s callback never fires,
  // force-exit after a timeout rather than hanging forever. A real
  // service would also close DB pools, message queue connections, etc.
  // here before this timeout expires.
  const FORCE_EXIT_MS = 10_000;
  const forceExitTimer = setTimeout(() => {
    console.error(`still not closed after ${FORCE_EXIT_MS}ms — forcing exit`);
    process.exit(1);
  }, FORCE_EXIT_MS);
  forceExitTimer.unref(); // doesn't itself keep the process alive if everything else already exited

  server.close(() => {
    clearTimeout(forceExitTimer); // avoid a spurious force-exit timer left dangling on the clean path
    console.log('all in-flight requests finished, exiting cleanly');
    process.exit(0);
  });

  // server.close()'s callback waits for EVERY open socket, including
  // idle HTTP keep-alive connections with no request in flight — not
  // just the /slow request this demo is built to showcase. Closing
  // idle ones immediately means shutdown only actually waits on
  // genuinely in-flight work, matching what "graceful shutdown" is
  // meant to mean. closeIdleConnections() was only added in Node
  // 18.2.0, while this repo's declared floor is >=18.0.0 (package.json)
  // — feature-detect it rather than assuming it exists.
  if (typeof server.closeIdleConnections === 'function') {
    server.closeIdleConnections();
  }
}

// Windows doesn't reliably deliver SIGTERM the way Linux/macOS do
// (Node/libuv emulate SIGINT there via Ctrl+C, but not SIGTERM — see
// cluster-demo.js's comment in this same topic for more on this) —
// both handlers matter for real deployments, but on Windows, test this
// with Ctrl+C specifically.
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = server;
