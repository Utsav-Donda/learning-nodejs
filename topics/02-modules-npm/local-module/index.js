// Demonstrates consuming a local module via a relative path.
// Node resolves './math.js' relative to this file, not the cwd.
//
// Run: node index.js
const { add, multiply } = require('./math.js');

console.log('2 + 3 =', add(2, 3));
console.log('2 * 3 =', multiply(2, 3));
