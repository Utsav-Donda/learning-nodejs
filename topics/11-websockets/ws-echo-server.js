// A minimal WebSocket server using the `ws` library — no HTTP framework,
// just the raw protocol. Every message received is echoed back with a
// timestamp prefix.
//
// Run: node ws-echo-server.js
// Then, in another terminal: node ws-echo-client.js
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });

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
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

module.exports = wss;
