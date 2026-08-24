// Tests the parsePort() duplicated inline in app.js (exposed as
// app.parsePort — see the comment above module.exports in app.js).
// It's a separate copy from env-config-demo/parse-port.js on purpose
// (docker-demo is self-contained for its Dockerfile's build context),
// but it shares the same regression history, so it gets the same test
// coverage — plus the one behavior that's actually different here:
// PORT=0 is rejected instead of accepted, since it doesn't make sense
// inside a container.
//
// Run: node --test parse-port.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const app = require('./app.js');

const { parsePort } = app;

describe('docker-demo app.js — parsePort', () => {
  test('falls back to the default when unset (undefined)', () => {
    assert.equal(parsePort(undefined, 3000), 3000);
  });

  test('falls back to the default when set but empty ("PORT=")', () => {
    assert.equal(parsePort('', 3000), 3000);
  });

  test('falls back to the default when whitespace-only', () => {
    assert.equal(parsePort(' ', 3000), 3000);
  });

  test('rejects PORT=0 — unlike the shared parse-port.js, 0 is not supported inside a container', () => {
    assert.throws(() => parsePort('0', 3000), /PORT=0 is not supported/);
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

  test('rejects a non-numeric value', () => {
    assert.throws(() => parsePort('abc', 3000), /invalid PORT/);
  });
});
