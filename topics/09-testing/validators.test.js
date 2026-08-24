// Unit tests using Node's built-in test runner — no extra dependency
// needed (works the same way with Jest: describe/it/test + assertions).
//
// Run: node --test validators.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { isValidEmail, clamp } = require('./validators.js');

describe('isValidEmail', () => {
  test('accepts a well-formed email', () => {
    assert.equal(isValidEmail('ada@example.com'), true);
  });

  test('rejects a string with no @', () => {
    assert.equal(isValidEmail('not-an-email'), false);
  });

  test('rejects a string with no domain', () => {
    assert.equal(isValidEmail('ada@'), false);
  });
});

describe('clamp', () => {
  test('returns the value when already in range', () => {
    assert.equal(clamp(5, 0, 10), 5);
  });

  test('clamps to the minimum', () => {
    assert.equal(clamp(-5, 0, 10), 0);
  });

  test('clamps to the maximum', () => {
    assert.equal(clamp(15, 0, 10), 10);
  });

  test('throws when min > max', () => {
    assert.throws(() => clamp(5, 10, 0), RangeError);
  });
});
