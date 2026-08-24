# 11 — WebSockets & Real-time

## Overview

Building real-time features with WebSockets.

## Learning Objectives

- Understand how WebSockets differ from HTTP request/response.
- Build a WebSocket server with the `ws` library.
- Build a real-time app with Socket.IO (rooms, broadcasting).
- Understand basic pub/sub patterns for scaling real-time apps.

## Key Concepts

- [ ] WebSocket handshake and persistent connections
- [ ] `ws` library basics
- [ ] Socket.IO: events, rooms, namespaces
- [ ] Pub/sub for multi-instance scaling (concept)

## Examples

Requires `ws`, `socket.io`, and `socket.io-client` — already listed in the repo root [package.json](../../package.json); run `npm install` at the repo root first.

- [`ws-echo-server.js`](ws-echo-server.js) + [`ws-echo-client.js`](ws-echo-client.js) — a raw WebSocket echo server and a scripted client that connects, sends two messages, and logs the echoes (exercise 1 solution — open [socketio-chat/public/index.html](socketio-chat/public/index.html) below for the browser-client half of that exercise).
  `node ws-echo-server.js` then, in another terminal, `node ws-echo-client.js`
- [`socketio-chat/`](socketio-chat/) — a room-based chat server: [`server.js`](socketio-chat/server.js) (join-room + broadcast logic), [`public/index.html`](socketio-chat/public/index.html) (browser client), and [`test-client.js`](socketio-chat/test-client.js) (a scripted two-user demo proving messages stay scoped to their room) (exercise 2 solution).
  `node socketio-chat/server.js`, then open `http://localhost:3000` in two tabs, or run `node socketio-chat/test-client.js`
- [`pubsub-concept.js`](pubsub-concept.js) — simulates why a single in-memory broadcast doesn't scale past one server instance, and how a shared pub/sub broker (e.g. Redis) fixes it.
  `node pubsub-concept.js`

## Exercises

1. Build a simple echo server with `ws` and a minimal HTML client.
2. Build a two-user chat room with Socket.IO.

## Resources

- [ws docs](https://github.com/websockets/ws)
- [Socket.IO docs](https://socket.io/docs/v4/)
