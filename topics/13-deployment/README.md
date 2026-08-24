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

Add runnable examples here, e.g. `Dockerfile`, `.github/workflows/ci-demo.yml` (example only), `pm2-demo/`.

## Exercises

1. Write a `Dockerfile` for one of the earlier Express projects and run it locally.
2. Set up a basic GitHub Actions workflow that installs dependencies and runs tests on push.

## Resources

- [Docker docs — Node.js guide](https://docs.docker.com/language/nodejs/)
