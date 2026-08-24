// Shared by cluster-demo.js, graceful-shutdown-demo.js, and
// profiling-target.js, plus security-hardening/app.js one directory
// down — locks in the same edge cases (empty string, whitespace,
// PORT=0, out-of-range) that caused real bugs across this topic and
// topic 13 before being fixed.
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

  test('null is treated like undefined — falls back to the default', () => {
    // Number(null) is a JS quirk that evaluates to 0 — without special
    // handling, parsePort(null, ...) would silently return 0 instead
    // of falling back, indistinguishable from an explicit PORT=0.
    assert.equal(parsePort(null, 3000), 3000);
  });

  test('an unparseable non-string value throws a clear "invalid PORT" error instead of an unrelated TypeError', () => {
    // env vars are always strings/undefined in practice, but this
    // function is shared across files now — a caller passing some
    // other type (e.g. an object from a config file) shouldn't crash
    // with "value.trim is not a function".
    assert.throws(() => parsePort({}, 3000), /invalid PORT/);
  });

  test('a numeric (non-string) value still parses correctly', () => {
    assert.equal(parsePort(8080, 3000), 8080);
  });
});
