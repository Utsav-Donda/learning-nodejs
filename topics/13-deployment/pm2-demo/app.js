// The app being process-managed — logs its PID on startup so it's easy
// to see PM2 restart it with a new PID after a crash or `pm2 restart`.
const http = require('node:http');

const PORT = process.env.PORT || 3000;

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
  console.log(`[pid ${process.pid}] listening on http://localhost:${PORT}`);
});
