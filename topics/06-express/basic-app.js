// A minimal Express app: JSON body parsing, route params, and a query
// string, contrasted with the manual work required in topic 05.
//
// Run: node basic-app.js
// Then:
//   curl http://localhost:3000/users/42
//   curl "http://localhost:3000/search?q=node"
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'welcome' });
});

app.get('/users/:id', (req, res) => {
  // Route params are parsed for you — compare to manual-router.js in topic 05.
  res.json({ id: req.params.id, name: 'Ada Lovelace' });
});

app.get('/search', (req, res) => {
  res.json({ query: req.query.q ?? null });
});

app.post('/users', (req, res) => {
  // express.json() middleware already parsed the body into req.body.
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  res.status(201).json({ message: 'user created', name });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
