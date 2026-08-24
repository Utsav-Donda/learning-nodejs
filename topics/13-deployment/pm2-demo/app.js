// The app being process-managed — logs its PID on startup so it's easy
// to see PM2 restart it with a new PID after a crash or `pm2 restart`.
const http = require('node:http');
// PM2 launches this file by its path (see ecosystem.config.js's
// `script` field), but Node still resolves this relative require by
// this file's own location, not by how the process was started — so
// sharing env-config-demo's port-parsing helper here is safe (unlike
// docker-demo/app.js, which genuinely can't reach outside its own
// directory, since `docker build` only sees the docker-demo/ folder).
const { parsePort } = require('../env-config-demo/parse-port.js');

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
