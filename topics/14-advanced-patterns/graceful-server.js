// Small, side-effect-free helpers shared across this topic's demos —
// same rationale as parse-port.js: these files are the same topic's
// worked examples (not independently distributed folders with a build-
// context constraint like topic 13's docker-demo), so centralizing
// logic that was identically duplicated is a straightforward win.

// Without this attached to a server, a bind failure (e.g. the port is
// already in use by another running demo) crashes the process with a
// raw, confusing stack trace instead of a clear message.
function handleBindErrors(server) {
  server.on('error', (err) => {
    console.error('server error:', err.message);
    process.exit(1);
  });
}

// Stops accepting new connections but waits for requests already in
// progress to finish before `onDone` fires — unlike just killing the
// process. Also closes idle keep-alive connections immediately
// (feature-detected: only added in Node 18.2.0, while this repo's
// declared floor is >=18.0.0/package.json), since server.close()'s
// callback would otherwise wait for those too, not just genuinely
// in-flight work.
function drainServer(server, onDone) {
  server.close(onDone);
  if (typeof server.closeIdleConnections === 'function') {
    server.closeIdleConnections();
  }
}

module.exports = { handleBindErrors, drainServer };
