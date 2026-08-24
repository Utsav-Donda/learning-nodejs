# 05 — HTTP Servers (core `http` module)

## Overview

Building an HTTP server from scratch with Node's built-in `http` module, before reaching for a framework.

## Learning Objectives

- Understand the request/response lifecycle in Node's `http` module.
- Manually parse URLs, query strings, and request bodies.
- Implement basic routing without a framework.
- Set headers and status codes correctly.

## Key Concepts

- [ ] `http.createServer`, `req`/`res` objects
- [ ] Reading a request body as a stream
- [ ] Manual routing by method + pathname
- [ ] Setting response headers and status codes

## Examples

- [`hello-server.js`](hello-server.js) — the smallest possible server: one handler, plain text response.
- [`manual-router.js`](manual-router.js) — routes by method + path using `URL` and a plain if/else chain, no framework (exercise 1 solution).
- [`json-api-no-framework.js`](json-api-no-framework.js) — manually buffers and parses a JSON request body, then echoes it back (exercise 2 solution).

Each listens on port 3000 by default (override with `PORT=xxxx node <file>.js`).
`node hello-server.js` then `curl http://localhost:3000`.

## Exercises

1. Build a server that responds differently based on method and path, with no framework.
2. Parse a JSON request body manually and echo it back.

## Resources

- [Node.js docs — HTTP](https://nodejs.org/api/http.html)
