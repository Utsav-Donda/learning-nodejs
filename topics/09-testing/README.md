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

Add runnable test files here, e.g. `math.test.js`, `api.integration.test.js`.

## Exercises

1. Write unit tests for a pure function (e.g. a validator or formatter).
2. Write an integration test that spins up an Express app and asserts on a real HTTP response.

## Resources

- [Node.js docs — Test runner](https://nodejs.org/api/test.html)
- [Jest docs](https://jestjs.io/)
