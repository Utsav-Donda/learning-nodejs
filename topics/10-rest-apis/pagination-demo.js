// Exercise 2 solution: pagination, filtering, and sorting on a list
// endpoint, using query string conventions common to REST APIs.
//
// Run: node pagination-demo.js
// Then:
//   curl "http://localhost:3000/products"
//   curl "http://localhost:3000/products?page=2&pageSize=5"
//   curl "http://localhost:3000/products?category=books"
//   curl "http://localhost:3000/products?sort=-price"   (leading "-" = descending)
const express = require('express');

const app = express();

// 42 fake products across a few categories, for something worth paginating.
const categories = ['books', 'electronics', 'toys'];
const products = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: categories[i % categories.length],
  price: Math.round((5 + i * 3.7) * 100) / 100,
}));

app.get('/products', (req, res) => {
  let results = [...products];

  // --- filtering ---
  if (req.query.category) {
    results = results.filter((p) => p.category === req.query.category);
  }

  // --- sorting: ?sort=price (asc) or ?sort=-price (desc) ---
  if (req.query.sort) {
    // Express parses a repeated query key (?sort=a&sort=b) as an array —
    // take the last one so this never crashes on unexpected input.
    const sortParam = Array.isArray(req.query.sort) ? req.query.sort.at(-1) : req.query.sort;
    const field = sortParam.replace(/^-/, '');
    const direction = sortParam.startsWith('-') ? -1 : 1;
    results.sort((a, b) => {
      if (a[field] === b[field]) return 0; // preserve relative order for ties
      return (a[field] > b[field] ? 1 : -1) * direction;
    });
  }

  // --- pagination ---
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 10));
  const start = (page - 1) * pageSize;
  const pageResults = results.slice(start, start + pageSize);

  res.json({
    data: pageResults,
    meta: {
      page,
      pageSize,
      total: results.length,
      totalPages: Math.ceil(results.length / pageSize),
    },
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
}

module.exports = app;
