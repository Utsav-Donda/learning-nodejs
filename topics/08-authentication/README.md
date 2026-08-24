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

Add runnable scripts here, e.g. `password-hashing.js`, `jwt-auth-demo/`, `session-auth-demo/`.

## Exercises

1. Build a signup/login flow with hashed passwords and JWT issuance.
2. Add middleware that protects a route by verifying the JWT.

## Resources

- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
