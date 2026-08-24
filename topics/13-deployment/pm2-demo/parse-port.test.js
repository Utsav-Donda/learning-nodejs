// Tests parse-port.js directly — a pure module with no side effects,
// so this suite is unaffected by whatever PORT happens to be set in
// the ambient shell environment.
//
// Run: node --test parse-port.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { parsePort } = require('./parse-port.js');

describe('pm2-demo parse-port.js', () => {
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

  test('treats an explicit "0" as 0, not as unset/falsy — meaningful here, unlike in docker-demo', () => {
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
