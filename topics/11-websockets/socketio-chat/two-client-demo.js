// A scripted two-user demo using socket.io-client — connects two
// clients to the same room and shows that a chat message from one is
// broadcast to both (including the sender), while a client in a
// different room never sees it.
//
// This is a manual demo, not an automated test (no assertions) — it's
// deliberately NOT named test-*.js so `npm test` (node --test) doesn't
// sweep it in as a fake test that always "passes" whether or not a
// server is actually running.
//
// Run: node two-client-demo.js   (after starting server.js)
const { io } = require('socket.io-client');

const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

function makeClient(username, room) {
  const socket = io(URL, { reconnection: false });

  socket.on('connect', () => {
    socket.emit('join-room', { username, room });
  });

  socket.on('system-message', (text) => console.log(`[${username}] system: ${text}`));
  socket.on('chat-message', ({ username: from, text }) => {
    console.log(`[${username}] chat: ${from} says "${text}"`);
  });

  return socket;
}

async function main() {
  const alice = makeClient('alice', 'general');
  const bob = makeClient('bob', 'general');
  const carol = makeClient('carol', 'random'); // different room — should never see "general" chat

  await new Promise((resolve) => setTimeout(resolve, 300)); // let joins settle

  alice.emit('chat-message', 'hey bob!');

  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log('\n(carol is in a different room and should see no chat-message above)');

  alice.close();
  bob.close();
  carol.close();
}

main();
