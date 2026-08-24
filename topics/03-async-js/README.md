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

Add runnable scripts here, e.g. `callback-hell.js`, `promise-chaining.js`, `async-await-errors.js`.

## Exercises

1. Rewrite a callback-based function to use promises, then to use async/await.
2. Fetch multiple resources concurrently with `Promise.all` and handle a partial failure with `Promise.allSettled`.

## Resources

- [MDN — Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
