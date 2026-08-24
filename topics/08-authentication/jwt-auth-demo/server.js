// Exercise 1 + 2 solution: a signup/login flow that hashes passwords
// with bcrypt and issues a JWT, plus middleware that protects a route
// by verifying that JWT.
//
// Run: node server.js
// Then:
//   curl -X POST http://localhost:3000/signup -H "Content-Type: application/json" -d '{"username":"ada","password":"secret123"}'
//   curl -X POST http://localhost:3000/login  -H "Content-Type: application/json" -d '{"username":"ada","password":"secret123"}'
//   curl http://localhost:3000/me -H "Authorization: Bearer <token from login>"
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In a real app this MUST come from an environment variable / secret
// manager, never hardcoded — anyone with this secret can forge tokens.
const JWT_SECRET = process.env.JWT_SECRET || 'demo-only-secret-do-not-use-in-production';
const TOKEN_EXPIRY = '1h';

const app = express();
app.use(express.json());

// In-memory user store for demo purposes only.
const users = new Map(); // username -> { username, passwordHash }

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  if (users.has(username)) {
    return res.status(409).json({ error: 'username already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(username, { username, passwordHash });

  res.status(201).json({ message: 'signed up', username });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);

  // Same error for "no such user" and "wrong password" — don't leak
  // which one it was, that helps attackers enumerate valid usernames.
  const invalidCreds = () => res.status(401).json({ error: 'invalid username or password' });

  if (!user) return invalidCreds();

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) return invalidCreds();

  const token = jwt.sign({ sub: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  res.json({ token });
});

// Middleware: verifies the Authorization: Bearer <token> header and
// attaches the decoded payload to req.user for downstream handlers.
function requireAuth(req, res, next) {
  const header = req.header('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'missing or malformed Authorization header' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET); // throws on expiry/invalid signature
    next();
  } catch (err) {
    res.status(401).json({ error: `invalid token: ${err.message}` });
  }
}

app.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.user.sub, tokenIssuedAt: new Date(req.user.iat * 1000) });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
