// A minimal WebSocket client using the `ws` library, to exercise
// ws-echo-server.js. Sends a couple of messages, logs the echoes, then
// closes the connection.
//
// Run: node ws-echo-client.js   (after starting ws-echo-server.js)
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const socket = new WebSocket(`ws://localhost:${PORT}`);

socket.on('open', () => {
  console.log('connected to server');
  socket.send('hello from the client');
  socket.send('a second message');
});

let messagesReceived = 0;

socket.on('message', (data) => {
  messagesReceived += 1;
  console.log('server says:', data.toString());

  // Welcome message + 2 echoes = 3 total messages expected.
  if (messagesReceived >= 3) {
    socket.close();
  }
});

socket.on('close', () => {
  console.log('connection closed');
});

socket.on('error', (err) => {
  console.error('connection error — is ws-echo-server.js running?', err.message);
  process.exitCode = 1;
});
