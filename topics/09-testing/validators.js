// Plain, dependency-free functions — easy to unit test because they're
// pure (same input always produces the same output, no side effects).
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clamp(value, min, max) {
  if (min > max) throw new RangeError('min cannot be greater than max');
  return Math.min(Math.max(value, min), max);
}

module.exports = { isValidEmail, clamp };
