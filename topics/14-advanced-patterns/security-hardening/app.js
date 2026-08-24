// Adds security hardening to an Express app: security headers via
// helmet, rate limiting to slow down brute-force/abuse, and basic
// input sanitization on top of the validation pattern from topic 10.
//
// Run: node app.js
// Then:
//   curl -i http://localhost:3000/          (inspect the security headers helmet adds)
//   for i in $(seq 1 12); do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/login; done
//     (first several succeed, later ones get 429 once the rate limit trips)
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { parsePort } = require('../parse-port.js');

const app = express();

// helmet and rate limiting are registered BEFORE express.json() below —
// Express runs middleware in registration order, and express.json()
// throws (a SyntaxError) on a malformed body, which skips straight to
// the error-handling middleware at the bottom, bypassing anything
// registered AFTER it. Registering these first means every request —
// even one with an invalid JSON body — still gets helmet's headers and
// counts against the rate limits, instead of malformed requests
// slipping through both unprotected.

// helmet sets ~15 security-related headers (X-Content-Type-Options,
// Strict-Transport-Security, disables X-Powered-By, etc.) with sane
// defaults — cheap, broad protection with one line.
app.use(helmet());

// A generous limiter applies to everything by default...
app.use(rateLimit({ windowMs: 60 * 1000, limit: 100 }));

// ...and a stricter one is layered on top of just the login route —
// attempted logins are exactly the kind of endpoint brute-force
// attacks target, so it gets a tighter budget than the rest of the app.
// Mounted with app.use('/login', ...) (path-scoped, runs for any
// method) rather than attached only to the POST handler further down —
// that way it still counts a malformed-JSON request against the same
// budget, since path-scoped middleware runs before body parsing too.
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 attempts per window per IP
  standardHeaders: true, // adds RateLimit-* response headers
  legacyHeaders: false,
  message: { error: 'too many login attempts, try again in a minute' },
});
app.use('/login', loginLimiter);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'try `curl -i` to see the security headers helmet added' });
});

app.post('/login', (req, res) => {
  // Deliberately simplified: real auth would hash-compare a password
  // (see topic 08) — the point here is the rate limiter in front of it.
  const { username } = req.body ?? {};

  // Basic input sanitization: reject unexpected types outright rather
  // than coercing them, so a malformed/malicious payload can't sneak a
  // non-string into whatever uses `username` downstream (a query, a
  // log line, etc).
  if (typeof username !== 'string' || username.length === 0 || username.length > 100) {
    return res.status(400).json({ error: 'username must be a non-empty string up to 100 characters' });
  }

  res.json({ message: `login attempt received for "${username}"` });
});

// A catch-all 404, matching topic 10's pattern — without this,
// unmatched routes fall through to Express's default (non-JSON) 404
// page, inconsistent with every other response this "hardened" app
// returns.
app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

// Error-handling middleware, also matching topic 10's pattern — without
// this, an error (e.g. body-parser's SyntaxError on malformed JSON)
// falls through to Express's default error handler, which can include
// the error's stack trace/internal file paths in the response — exactly
// the kind of information disclosure a "security hardening" example
// shouldn't leave in place.
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'internal server error';
  res.status(status).json({ error: message });
});

if (require.main === module) {
  const PORT = parsePort(process.env.PORT, 3000);
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
