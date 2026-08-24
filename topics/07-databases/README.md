# 07 — Databases

## Overview

Connecting Node.js apps to relational and document databases.

## Learning Objectives

- Connect to a SQL database (e.g. PostgreSQL) and run queries safely (parameterized queries).
- Connect to a NoSQL database (e.g. MongoDB) and perform CRUD operations.
- Understand when to use a raw driver vs an ORM/ODM (e.g. Prisma, Sequelize, Mongoose).
- Understand connection pooling basics.

## Key Concepts

- [ ] SQL basics from Node (`pg` or similar driver)
- [ ] Parameterized queries (SQL injection prevention)
- [ ] MongoDB basics (`mongodb` driver or Mongoose)
- [ ] ORM/ODM tradeoffs
- [ ] Connection pooling

## Examples

Requires `pg` and `mongodb` — already listed in the repo root [package.json](../../package.json); run `npm install` at the repo root first. Both scripts need a real database running locally (or reachable via the URI env vars below) — without one, they log a clear connection error and exit rather than hang.

- [`pg-crud.js`](pg-crud.js) — full CRUD against PostgreSQL with the `pg` driver, using parameterized (`$1`, `$2`) queries throughout to prevent SQL injection.
  `DATABASE_URL=postgres://user:pass@localhost:5432/dbname node pg-crud.js`
- [`mongo-crud.js`](mongo-crud.js) — full CRUD against MongoDB with the official driver directly (no ODM), to see what an ODM like Mongoose abstracts away.
  `MONGODB_URI=mongodb://localhost:27017 node mongo-crud.js`

## Exercises

1. Build a small CRUD script against a local Postgres or SQLite database.
2. Build the same CRUD operations against MongoDB and compare the developer experience.

## Resources

- [node-postgres docs](https://node-postgres.com/)
- [MongoDB Node.js Driver docs](https://www.mongodb.com/docs/drivers/node/current/)
