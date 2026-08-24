# 01 — Fundamentals & the Runtime

## Overview

The Node.js runtime, its event-driven architecture, and the basics that everything else builds on.

## Learning Objectives

- Understand what Node.js is (V8 + libuv) and how it differs from a browser environment.
- Understand the event loop: phases, microtasks vs macrotasks, `process.nextTick`.
- Know Node's global objects (`global`, `process`, `__dirname`, `__filename`, `Buffer`).
- Understand the difference between CommonJS (`require`) and ES Modules (`import`).

## Key Concepts

- [ ] The event loop and its phases (timers, pending callbacks, poll, check, close callbacks)
- [ ] Blocking vs non-blocking operations
- [ ] `process` object: `argv`, `env`, `exit`, `on('uncaughtException')`
- [ ] CommonJS vs ESM: `require`/`module.exports` vs `import`/`export`, `"type": "module"`

## Examples

Add runnable scripts here as you work through the concepts, e.g. `event-loop-order.js`, `globals-demo.js`, `esm-vs-cjs/`.

## Exercises

1. Write a script that logs output demonstrating the order of `setTimeout`, `setImmediate`, and `process.nextTick`.
2. Convert a small CommonJS module to ESM and run it.

## Resources

- [Node.js docs — Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
