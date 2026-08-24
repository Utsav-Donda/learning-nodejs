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

const app = express();
app.use(express.json());

// helmet sets ~15 security-related headers (X-Content-Type-Options,
// Strict-Transport-Security, disables X-Powered-By, etc.) with sane
// defaults — cheap, broad protection with one line.
app.use(helmet());

// Rate limiting middleware must be registered BEFORE the routes it's
// meant to protect — Express runs middleware/routes in registration
// order, so a limiter added after a route has already matched and
// responded would never actually run for that route.
//
// A generous limiter applies to everything by default...
app.use(rateLimit({ windowMs: 60 * 1000, limit: 100 }));

// ...and a stricter one is layered on top of just the login route —
// attempted logins are exactly the kind of endpoint brute-force
// attacks target, so it gets a tighter budget than the rest of the app.
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 attempts per window per IP
  standardHeaders: true, // adds RateLimit-* response headers
  legacyHeaders: false,
  message: { error: 'too many login attempts, try again in a minute' },
});

app.get('/', (req, res) => {
  res.json({ message: 'try `curl -i` to see the security headers helmet added' });
});

app.post('/login', loginLimiter, (req, res) => {
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

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
