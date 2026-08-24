# 10 — REST APIs

## Overview

Designing and building well-structured REST APIs.

## Learning Objectives

- Apply REST conventions: resources, HTTP verbs, status codes.
- Validate incoming request data (e.g. with `zod` or `joi`).
- Design consistent error response shapes.
- Understand basic API versioning strategies.

## Key Concepts

- [ ] Resource-oriented URL design
- [ ] Correct use of status codes (200/201/204/400/401/403/404/409/422/500)
- [ ] Request validation
- [ ] Consistent error response format
- [ ] Pagination, filtering, sorting conventions
- [ ] API versioning (URL vs header-based)

## Examples

Requires `express` — already listed in the repo root [package.json](../../package.json); run `npm install` at the repo root first.

- [`validated-api/`](validated-api/) — full CRUD for a `todos` resource under `/api/v1`, with hand-rolled request validation ([`validation.js`](validated-api/validation.js)), a consistent `{ error: { message, details } }` shape for every failure, and correct status codes (200/201/204/404/422) (exercise 1 solution).
  `node validated-api/server.js`
- [`pagination-demo.js`](pagination-demo.js) — a `/products` list endpoint supporting `?page=`/`?pageSize=` pagination, `?category=` filtering, and `?sort=field`/`?sort=-field` sorting (exercise 2 solution).
  `node pagination-demo.js`

## Exercises

1. Design and build a small REST API for a single resource (e.g. "todos") with full CRUD and validation.
2. Add pagination to a list endpoint.

## Resources

- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
