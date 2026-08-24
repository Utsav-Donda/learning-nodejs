// Demonstrates the pub/sub pattern that WebSocket/Socket.IO servers
// need once you scale to more than one server instance.
//
// A single process can broadcast to all its own connected sockets using
// nothing more than an in-memory event bus (shown below). The problem:
// if you run 3 instances of your server behind a load balancer, a
// message published on instance A never reaches clients connected to
// instances B or C — each process has its own isolated memory.
//
// The standard fix is an external pub/sub broker (commonly Redis, via
// `socket.io-redis-adapter`) that every instance subscribes to: instance
// A publishes to Redis, Redis fans the message out to B and C, and each
// of them broadcasts to its own locally-connected sockets. This file
// only demonstrates the *pattern* with an in-memory EventEmitter — it
// does not include a real Redis dependency.
//
// Run: node pubsub-concept.js
const { EventEmitter } = require('node:events');

// Stand-in for "Redis pub/sub" — in production this would be a Redis
// client, and publish/subscribe would cross process boundaries.
const broker = new EventEmitter();

function createServerInstance(name) {
  const localSockets = []; // pretend list of WebSocket connections on this instance

  function connectClient(clientName) {
    localSockets.push(clientName);
    console.log(`[${name}] client "${clientName}" connected`);
  }

  // Every instance subscribes to the shared broker...
  broker.on('chat-message', (message) => {
    // ...and fans it out to only the sockets connected to THIS instance.
    for (const client of localSockets) {
      console.log(`[${name}] -> delivering to "${client}": ${message}`);
    }
  });

  function broadcast(message) {
    console.log(`[${name}] publishing: ${message}`);
    broker.emit('chat-message', message); // in real life: redisClient.publish(...)
  }

  return { connectClient, broadcast };
}

const instanceA = createServerInstance('instance-A');
const instanceB = createServerInstance('instance-B');

// alice is connected to instance A, bob to instance B — a realistic
// setup behind a load balancer.
instanceA.connectClient('alice');
instanceB.connectClient('bob');

console.log('\n--- alice sends a message (connected to instance A) ---');
instanceA.broadcast('hello from alice');
// Notice bob still receives it, even though he's connected to instance B —
// that's the whole point of the shared broker.
