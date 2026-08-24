# 03 — Asynchronous JavaScript

## Overview

The core async patterns used throughout Node.js: callbacks, promises, and async/await.

## Learning Objectives

- Recognize and avoid callback hell; understand error-first callbacks.
- Create and chain promises; understand `Promise.all`/`allSettled`/`race`.
- Use `async`/`await` with proper `try`/`catch` error handling.
- Understand unhandled promise rejections and how Node reports them.

## Key Concepts

- [ ] Error-first callback convention
- [ ] Promise states and chaining
- [ ] `async`/`await` syntax and error handling
- [ ] `Promise.all` vs `Promise.allSettled` vs `Promise.race`
- [ ] Common pitfalls: forgetting `await`, unhandled rejections

## Examples

- [`callback-hell.js`](callback-hell.js) — a 3-step dependent flow using nested error-first callbacks.
- [`promise-chaining.js`](promise-chaining.js) — the same flow flattened with `.then()`/`.catch()`.
- [`async-await-errors.js`](async-await-errors.js) — the same flow again with `async`/`await` and `try`/`catch`, including a guarded top-level call to avoid unhandled rejections.
- [`promise-combinators.js`](promise-combinators.js) — side-by-side comparison of `Promise.all`, `Promise.allSettled`, and `Promise.race`.

Run any of them with `node <file>.js`.

## Exercises

1. Rewrite a callback-based function to use promises, then to use async/await.
2. Fetch multiple resources concurrently with `Promise.all` and handle a partial failure with `Promise.allSettled`.

## Resources

- [MDN — Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
