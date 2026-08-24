// A small room-based chat server built on Socket.IO, layered on top of
// a plain Node http server (Socket.IO needs a real HTTP server to
// upgrade connections from).
//
// Run: node server.js
// Then open http://localhost:3000 in two browser tabs, or run
// test-client.js from another terminal for a scripted demo.
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }
  res.writeHead(404);
  res.end('not found');
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log(`socket connected: ${socket.id}`);

  socket.on('join-room', ({ room, username }) => {
    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;

    // Broadcast to everyone else in the room, not back to the sender.
    socket.to(room).emit('system-message', `${username} joined ${room}`);
    socket.emit('system-message', `you joined ${room}`);
  });

  socket.on('chat-message', (text) => {
    const { room, username } = socket.data;
    if (!room) return; // ignore messages sent before joining a room

    // io.to(room) sends to EVERY socket in the room, including sender —
    // that's what makes the sender see their own message appear too.
    io.to(room).emit('chat-message', { username, text, at: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    const { room, username } = socket.data;
    if (room) socket.to(room).emit('system-message', `${username} left ${room}`);
    console.log(`socket disconnected: ${socket.id}`);
  });
});

if (require.main === module) {
  httpServer.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = { httpServer, io };
