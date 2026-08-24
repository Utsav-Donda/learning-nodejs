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

Add runnable scripts here, e.g. `pg-crud.js`, `mongo-crud.js`, `prisma-demo/`.

## Exercises

1. Build a small CRUD script against a local Postgres or SQLite database.
2. Build the same CRUD operations against MongoDB and compare the developer experience.

## Resources

- [node-postgres docs](https://node-postgres.com/)
- [MongoDB Node.js Driver docs](https://www.mongodb.com/docs/drivers/node/current/)
