# 14 — Advanced Patterns

## Overview

Deeper runtime and production-hardening topics for scaling and securing Node.js apps.

## Learning Objectives

- Use worker threads for CPU-bound work without blocking the event loop.
- Use the `cluster` module (or a process manager) to use multiple CPU cores.
- Profile and diagnose basic performance issues.
- Apply common security hardening practices (helmet, rate limiting, input sanitization).

## Key Concepts

- [ ] `worker_threads` for CPU-bound tasks
- [ ] `cluster` module for multi-core usage
- [ ] Basic profiling (`--prof`, `clinic.js`, Chrome DevTools)
- [ ] Security hardening: `helmet`, rate limiting, CORS, input sanitization
- [ ] Graceful shutdown handling

## Examples

- [`worker-threads-demo.js`](worker-threads-demo.js) — runs `fib(40)` on the main thread (freezing a concurrent heartbeat timer) vs. in a worker thread (heartbeat keeps firing), to make the blocking difference visible (exercise 1 solution). Shares [`fibonacci.js`](fibonacci.js) with `profiling-target.js` below.
  `node worker-threads-demo.js`
- [`cluster-demo.js`](cluster-demo.js) — forks one worker process per CPU core sharing one port, replaces a worker if it crashes, and — on `SIGINT`/`SIGTERM` — tells every worker to drain its in-flight requests (`server.close()`) via an IPC message and waits for all of them to actually exit before the primary itself exits, rather than just killing everything and exiting immediately.
  `node cluster-demo.js`, then `curl http://localhost:3000` a few times. **Windows note:** `cluster`'s round-robin scheduling isn't available there (the OS distributes connections instead), so one worker may answer most/all requests in a short test — that's expected, not a bug. Stop with Ctrl+C; on Windows, `SIGTERM` isn't reliably delivered the way it is on Linux/macOS (see the code comments).
- [`security-hardening/`](security-hardening/) — adds `helmet` (security headers), `express-rate-limit` (a stricter limiter on `/login`, a looser one everywhere else), basic input-type validation, and — matching topic 10's pattern — a JSON 404 handler and centralized error-handling middleware, so a malformed request never falls through to Express's default error page (which can include a stack trace) (exercise 2 solution).
  `node security-hardening/app.js`, then `curl -i http://localhost:3000/` to see the headers helmet adds, or hammer `/login` past 5 requests/minute to see a 429.
- [`graceful-shutdown-demo.js`](graceful-shutdown-demo.js) — on `SIGINT`/`SIGTERM`, stops accepting new connections but waits for in-flight requests to finish (with a force-exit safety-net timeout) before exiting.
  `node graceful-shutdown-demo.js`, start a slow request (`curl http://localhost:3000/slow &`), then Ctrl+C the server immediately and watch it wait ~3s for that request before actually exiting.
- [`profiling-target.js`](profiling-target.js) + [`profiling-cheatsheet.md`](profiling-cheatsheet.md) — a small CPU-bound server to point Node's built-in `--cpu-prof`, `--inspect` + Chrome DevTools, `--prof`, or `clinic.js` at, with commands and what to look for in each.

## Exercises

1. Offload a CPU-intensive calculation to a worker thread and compare it against running it on the main thread. (See `worker-threads-demo.js`.)
2. Add `helmet` and basic rate limiting to an existing Express app from an earlier topic — try it on topic 8's `jwt-auth-demo` or topic 10's `validated-api`. (`security-hardening/` shows the pattern on a small standalone app rather than modifying an earlier one directly, so you can compare your result against it.)

## Resources

- [Node.js docs — Worker threads](https://nodejs.org/api/worker_threads.html)
- [Node.js docs — Cluster](https://nodejs.org/api/cluster.html)
