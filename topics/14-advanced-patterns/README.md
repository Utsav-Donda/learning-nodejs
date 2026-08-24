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

Add runnable examples here, e.g. `worker-threads-demo.js`, `cluster-demo.js`.

## Exercises

1. Offload a CPU-intensive calculation to a worker thread and compare it against running it on the main thread.
2. Add `helmet` and basic rate limiting to an existing Express app from an earlier topic.

## Resources

- [Node.js docs — Worker threads](https://nodejs.org/api/worker_threads.html)
- [Node.js docs — Cluster](https://nodejs.org/api/cluster.html)
