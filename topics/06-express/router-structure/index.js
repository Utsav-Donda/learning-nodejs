// Exercise 2 solution: mounts a modular router and adds centralized
// error-handling middleware that returns consistent JSON error responses.
//
// Run: node index.js
// Then:
//   curl http://localhost:3000/todos
//   curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Ship it"}'
//   curl http://localhost:3000/boom   -> triggers the error handler
const express = require('express');
const todosRouter = require('./todos.router.js');

const app = express();
app.use(express.json());

app.use('/todos', todosRouter);

// A route that throws, to demonstrate the error-handling middleware below.
app.get('/boom', () => {
  throw new Error('something went wrong on purpose');
});

// 404 handler — runs if no route above matched.
app.use((req, res) => {
  res.status(404).json({ error: 'not found', path: req.originalUrl });
});

// Error-handling middleware MUST take 4 arguments — Express identifies it
// by arity. It must be registered last, after all routes.
app.use((err, req, res, next) => {
  console.error(err);
  // Respect a status already attached to the error (e.g. body-parser
  // sets 400 for malformed JSON) instead of always answering 500.
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'internal server error';
  res.status(status).json({ error: message });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
