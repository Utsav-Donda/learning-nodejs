# 06 — Express.js

## Overview

The most widely used Node.js web framework: routing, middleware, and app structure.

## Learning Objectives

- Set up an Express app with routing and route parameters.
- Understand and write middleware (built-in, third-party, custom).
- Handle errors centrally with an error-handling middleware.
- Structure a multi-route Express app (routers, controllers).

## Key Concepts

- [ ] `app.get/post/put/delete`, route params, query strings
- [ ] Middleware order and `next()`
- [ ] `express.Router()` for modular routes
- [ ] Centralized error handling middleware
- [ ] Serving static files, basic templating (optional)

## Examples

Requires `express` — already listed in the repo root [package.json](../../package.json); run `npm install` at the repo root first.

- [`basic-app.js`](basic-app.js) — routing, route params, query strings, and `express.json()` body parsing (contrast with the manual work in topic 05).
- [`middleware-demo.js`](middleware-demo.js) — a request-logging middleware plus a path-scoped auth middleware, showing middleware order and `next()` (exercise 1 solution).
- [`router-structure/`](router-structure/) — a modular app: [`todos.router.js`](router-structure/todos.router.js) built with `express.Router()`, mounted in [`index.js`](router-structure/index.js) alongside a 404 handler and centralized error-handling middleware (exercise 2 solution).

Each listens on port 3000 by default. `node basic-app.js` then `curl http://localhost:3000/users/42`.

## Exercises

1. Build a small Express app with at least 3 routes and one custom middleware (e.g. request logging).
2. Add centralized error handling that returns consistent JSON error responses.

## Resources

- [Express docs](https://expressjs.com/)
