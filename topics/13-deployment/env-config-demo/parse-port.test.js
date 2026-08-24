// parsePort() was the single most regression-prone piece of logic in
// this topic's history — a PORT=0-truthy bug, an empty-string bug, a
// whitespace-only bug, and a missing out-of-range check were each
// found and fixed in separate review rounds. This test locks in all of
// them so a future edit can't quietly reintroduce any of it.
//
// Run: node --test parse-port.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { parsePort } = require('./parse-port.js');

describe('parsePort', () => {
  test('falls back to the default when unset (undefined)', () => {
    assert.equal(parsePort(undefined, 3000), 3000);
  });

  test('falls back to the default when set but empty ("PORT=")', () => {
    assert.equal(parsePort('', 3000), 3000);
  });

  test('falls back to the default when whitespace-only', () => {
    assert.equal(parsePort(' ', 3000), 3000);
    assert.equal(parsePort('\t', 3000), 3000);
  });

  test('treats an explicit "0" as 0, not as unset/falsy', () => {
    // The whole point of this function: PORT=0 is a real convention
    // meaning "let the OS pick a free port" and must not be silently
    // overridden to the fallback the way `Number(x) || fallback` would.
    assert.equal(parsePort('0', 3000), 0);
  });

  test('parses a normal numeric string', () => {
    assert.equal(parsePort('8080', 3000), 8080);
  });

  test('rejects a negative port', () => {
    assert.throws(() => parsePort('-1', 3000), /invalid PORT/);
  });

  test('rejects a port above 65535', () => {
    assert.throws(() => parsePort('99999', 3000), /invalid PORT/);
  });

  test('accepts the maximum valid port, 65535', () => {
    assert.equal(parsePort('65535', 3000), 65535);
  });

  test('rejects a non-numeric value', () => {
    assert.throws(() => parsePort('abc', 3000), /invalid PORT/);
  });

  test('rejects a non-integer value', () => {
    assert.throws(() => parsePort('3000.5', 3000), /invalid PORT/);
  });
});
