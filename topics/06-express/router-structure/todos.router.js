// A modular route group using express.Router(), mountable on any prefix
// from the parent app (see index.js).
const express = require('express');

const router = express.Router();

// In-memory store for demo purposes only — resets on every restart.
let todos = [{ id: 1, title: 'Learn Express routers', done: false }];
let nextId = 2;

router.get('/', (req, res) => {
  res.json(todos);
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const todo = { id: nextId++, title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

router.get('/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'todo not found' });
  res.json(todo);
});

router.delete('/:id', (req, res) => {
  const before = todos.length;
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  if (todos.length === before) return res.status(404).json({ error: 'todo not found' });
  res.status(204).end();
});

module.exports = router;
