// Exercise 1 solution: a small REST API for a single resource ("todos")
// with full CRUD, request validation, correct status codes, and a
// consistent error response shape — plus URL-based API versioning.
//
// Run: node server.js
// Then:
//   curl http://localhost:3000/api/v1/todos
//   curl -X POST http://localhost:3000/api/v1/todos -H "Content-Type: application/json" -d '{"title":"Ship it"}'
//   curl -X POST http://localhost:3000/api/v1/todos -H "Content-Type: application/json" -d '{}'   -> 422 with field errors
//   curl -X PATCH http://localhost:3000/api/v1/todos/1 -H "Content-Type: application/json" -d '{"done":true}'
//   curl -X DELETE http://localhost:3000/api/v1/todos/1
const express = require('express');
const { validateTodoInput } = require('./validation.js');

const app = express();
app.use(express.json());

let todos = [{ id: 1, title: 'Design the API', done: true }];
let nextId = 2;

// Every error response shares this shape, so clients can handle errors
// generically instead of parsing a different structure per endpoint.
function errorResponse(res, status, message, details) {
  res.status(status).json({ error: { message, details: details ?? undefined } });
}

const router = express.Router();

router.get('/todos', (req, res) => {
  res.json({ data: todos, meta: { total: todos.length } });
});

router.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return errorResponse(res, 404, 'todo not found');
  res.json({ data: todo });
});

router.post('/todos', (req, res) => {
  const errors = validateTodoInput(req.body);
  if (errors.length > 0) return errorResponse(res, 422, 'validation failed', errors);

  const todo = { id: nextId++, title: req.body.title.trim(), done: Boolean(req.body.done) };
  todos.push(todo);
  res.status(201).json({ data: todo });
});

router.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return errorResponse(res, 404, 'todo not found');

  // Partial validation: only check fields that were actually sent.
  const errors = validateTodoInput({ title: req.body.title ?? todo.title, done: req.body.done });
  if (errors.length > 0) return errorResponse(res, 422, 'validation failed', errors);

  if (req.body.title !== undefined) todo.title = req.body.title.trim();
  if (req.body.done !== undefined) todo.done = req.body.done;

  res.json({ data: todo });
});

router.delete('/todos/:id', (req, res) => {
  const before = todos.length;
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  if (todos.length === before) return errorResponse(res, 404, 'todo not found');
  res.status(204).end();
});

// URL-based versioning: /api/v1/... — a v2 could be mounted alongside
// this without breaking existing v1 clients.
app.use('/api/v1', router);

app.use((req, res) => errorResponse(res, 404, 'route not found'));

app.use((err, req, res, next) => {
  console.error(err);
  // Respect a status already attached to the error (e.g. body-parser
  // sets 400 for malformed JSON) — only fall back to 500 for truly
  // unexpected errors, and only expose the raw message for 4xx, since
  // 5xx messages can leak internals.
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'internal server error';
  errorResponse(res, status, message);
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
