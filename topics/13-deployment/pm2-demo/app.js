// The app being process-managed — logs its PID on startup so it's easy
// to see PM2 restart it with a new PID after a crash or `pm2 restart`.
const http = require('node:http');

// Deliberately duplicated (not imported) from env-config-demo's
// config.js — PM2 runs this file directly by path, so keeping it
// self-contained avoids a cross-directory require.
function parsePort(value, fallback) {
  // Unset or set-but-empty ("PORT=") both fall back to the default.
  // PORT=0 (a real convention meaning "let the OS assign a free port")
  // must NOT be treated as falsy and overridden the way a naive
  // `Number(x) || fallback` would do.
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`invalid PORT: "${value}"`);
  }
  return parsed;
}

const PORT = parsePort(process.env.PORT, 3000);

const server = http.createServer((req, res) => {
  if (req.url === '/crash') {
    // Simulates an unhandled failure, to observe PM2 auto-restarting
    // the process afterwards.
    process.nextTick(() => {
      throw new Error('simulated crash');
    });
    res.end('crashing...\n');
    return;
  }

  res.end(`hello from pid ${process.pid}\n`);
});

server.listen(PORT, () => {
  // Read back the actual bound port — with PORT=0 ("let the OS assign
  // a free port"), the OS-chosen port is only known via
  // server.address(), not the PORT const itself.
  console.log(`[pid ${process.pid}] listening on http://localhost:${server.address().port}`);
});
