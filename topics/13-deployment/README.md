# 13 — Deployment

## Overview

Taking a Node.js app from local development to a running production service.

## Learning Objectives

- Manage environment-specific configuration safely (`.env`, secrets).
- Run a Node app resiliently with a process manager (e.g. PM2) or container.
- Containerize an app with Docker.
- Understand the basics of a CI/CD pipeline (test → build → deploy).

## Key Concepts

- [ ] Environment variables and `.env` files (never commit secrets)
- [ ] Process managers (PM2) vs container orchestration
- [ ] Writing a `Dockerfile` for a Node app
- [ ] Basic CI/CD concepts (GitHub Actions)
- [ ] Logging and health checks in production

## Examples

- [`env-config-demo/`](env-config-demo/) — a `config.js` that centralizes env-var reading, validates required vars at startup (fails fast with a clear error instead of crashing later on first use), and loads a local `.env` file via Node's built-in `process.loadEnvFile()` (no `dotenv` package needed on Node 20.6+ — on older Node it's skipped gracefully rather than crashing, see [`config.test.js`](env-config-demo/config.test.js)). Port parsing lives in its own side-effect-free [`parse-port.js`](env-config-demo/parse-port.js), shared with `pm2-demo/` below. [`.env.example`](env-config-demo/.env.example) is committed with placeholder values; a real `.env` is gitignored.
  See the validation actually fire: `node env-config-demo/server.js` with no `.env` present exits immediately with `missing required environment variable: API_KEY`.
  Then run it for real: `cp env-config-demo/.env.example env-config-demo/.env`, then `node env-config-demo/server.js`.
- [`docker-demo/`](docker-demo/) — a small Express app plus a [`Dockerfile`](docker-demo/Dockerfile) following common practices: pinned base image, a separate `npm ci` layer for build caching, a non-root user, and a `HEALTHCHECK` against the app's own `/health` route (exercise 1 solution).
  `cd docker-demo && docker build -t docker-demo . && docker run --rm -p 3000:3000 docker-demo`
- [`pm2-demo/`](pm2-demo/) — an [`ecosystem.config.js`](pm2-demo/ecosystem.config.js) with `autorestart`, a restart cap, and a memory-based restart limit; [`app.js`](pm2-demo/app.js) has a `/crash` route to trigger PM2's auto-restart on purpose.
  `cd pm2-demo && npx pm2 start ecosystem.config.js`, then `curl http://localhost:3000/crash` and `npx pm2 status` to watch it recover.
- [`../../.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — a real GitHub Actions workflow (not just an example) that runs `npm ci && npm test` against Node 20.x and 22.x on every push/PR to this repo (exercise 2 solution).

> **Note on `docker-demo/`:** the Dockerfile was written and reviewed carefully but could not be build-tested in the environment this repo was authored in (Docker daemon unavailable there) — build and run it locally to confirm it works for you, and open an issue if something's off.

## Exercises

1. Write a `Dockerfile` for one of the earlier Express projects and run it locally. (See `docker-demo/`.)
2. Set up a basic GitHub Actions workflow that installs dependencies and runs tests on push. (See the real one at the repo root.)

## Resources

- [Docker docs — Node.js guide](https://docs.docker.com/language/nodejs/)
