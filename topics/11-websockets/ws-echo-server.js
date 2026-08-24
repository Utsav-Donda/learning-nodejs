// A minimal WebSocket server using the `ws` library — no HTTP framework,
// just the raw protocol. Every message received is echoed back with a
// timestamp prefix.
//
// Run: node ws-echo-server.js
// Then, in another terminal: node ws-echo-client.js
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;

function createServer(port) {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (socket, req) => {
    console.log(`client connected from ${req.socket.remoteAddress}`);

    socket.on('message', (data) => {
      const text = data.toString();
      console.log('received:', text);
      socket.send(`[echo @ ${new Date().toISOString()}] ${text}`);
    });

    socket.on('close', () => {
      console.log('client disconnected');
    });

    socket.send('welcome! send me a message and I will echo it back.');
  });

  wss.on('listening', () => {
    console.log(`WebSocket server listening on ws://localhost:${port}`);
  });

  // Without this, a bind failure (e.g. the port is already in use)
  // surfaces as an uncaught exception and crashes the process.
  wss.on('error', (err) => {
    console.error('WebSocket server error:', err.message);
    process.exitCode = 1;
  });

  return wss;
}

// Binding to a port is a side effect — only do it when this file is run
// directly, not when it's required (e.g. from a future test file).
if (require.main === module) {
  createServer(PORT);
}

module.exports = { createServer };
