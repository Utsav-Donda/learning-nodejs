# 08 — Authentication

## Overview

Common authentication patterns for Node.js web apps and APIs.

## Learning Objectives

- Hash and verify passwords securely (bcrypt/argon2) — never store plaintext.
- Implement session-based auth and understand cookies.
- Implement token-based auth with JWTs, including expiry and refresh tokens.
- Understand OAuth 2.0 at a conceptual level (e.g. "Sign in with Google").

## Key Concepts

- [ ] Password hashing (bcrypt/argon2), salting
- [ ] Sessions + cookies vs stateless JWTs
- [ ] JWT structure, signing, verification, expiry
- [ ] Refresh token rotation (concept)
- [ ] OAuth 2.0 authorization code flow (concept)

## Examples

Requires `bcryptjs` and `jsonwebtoken` (plus `express` for the server demo) — already listed in the repo root [package.json](../../package.json); run `npm install` at the repo root first.

- [`password-hashing.js`](password-hashing.js) — hashes and verifies a password with bcrypt, and shows why the same password produces a different hash each time (salting).
- [`jwt-auth-demo/`](jwt-auth-demo/) — a signup/login flow (`/signup`, `/login`) that hashes passwords and issues a JWT, plus a `requireAuth` middleware that protects `/me` by verifying the token (exercises 1 & 2 solution).
  `node jwt-auth-demo/server.js`

## A note on the JWT secret

The demo server uses a hardcoded fallback secret purely so it runs out of the box — in any real app, `JWT_SECRET` must come from an environment variable or secret manager and never be committed.

## Exercises

1. Build a signup/login flow with hashed passwords and JWT issuance.
2. Add middleware that protects a route by verifying the JWT.

## Resources

- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
