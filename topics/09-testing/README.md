# 09 — Testing

## Overview

Writing automated tests for Node.js code: unit tests, integration tests, and mocking.

## Learning Objectives

- Write unit tests using either Node's built-in `node:test` runner or Jest.
- Write integration tests for an HTTP API (e.g. with `supertest`).
- Mock external dependencies (database calls, network requests).
- Understand test coverage and how to read a coverage report.

## Key Concepts

- [ ] `node:test` / Jest basics: `describe`, `it`/`test`, assertions
- [ ] Mocking and stubbing
- [ ] Integration testing an Express app with `supertest`
- [ ] Test coverage tooling

## Examples

- [`validators.js`](validators.js) + [`validators.test.js`](validators.test.js) — unit tests for pure functions (`isValidEmail`, `clamp`) using Node's built-in `node:test` runner and `node:assert/strict`.
- [`api.integration.test.js`](api.integration.test.js) — boots the Express app from [topic 06](../06-express/basic-app.js) on an ephemeral port and asserts on real HTTP responses via the built-in `fetch`, no `supertest` needed.

Run everything from the repo root with `npm test` (equivalent to `node --test`, which discovers `*.test.js` files recursively), or run a single file directly: `node --test topics/09-testing/validators.test.js`.

## Exercises

1. Write unit tests for a pure function (e.g. a validator or formatter).
2. Write an integration test that spins up an Express app and asserts on a real HTTP response.

## Resources

- [Node.js docs — Test runner](https://nodejs.org/api/test.html)
- [Jest docs](https://jestjs.io/)
