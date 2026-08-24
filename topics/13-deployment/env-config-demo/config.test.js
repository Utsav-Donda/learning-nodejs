// Regression test for a real bug this demo hit: config.js unconditionally
// calling process.loadEnvFile() crashed with an unrelated TypeError on
// Node <20.6 (where that function doesn't exist), instead of proceeding
// to the intended fail-fast API_KEY validation. This test simulates
// that environment so a future edit can't silently reintroduce it —
// package.json declares support for Node >=18.0.0, but this repo's CI
// only runs 20.x/22.x, so nothing else would catch a regression here.
//
// Run: node --test config.test.js
const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const configPath = require.resolve('./config.js');

function freshRequireConfig() {
  delete require.cache[configPath];
  return require('./config.js');
}

describe('config.js on a simulated Node <20.6 (no process.loadEnvFile)', () => {
  let originalLoadEnvFile;
  let originalNodeEnv;
  let originalApiKey;
  let originalPort;

  beforeEach(() => {
    originalLoadEnvFile = process.loadEnvFile;
    originalNodeEnv = process.env.NODE_ENV;
    originalApiKey = process.env.API_KEY;
    // config.js computes `port` (via parsePort) eagerly, at the same
    // module-load time as the API_KEY check this suite exercises — an
    // ambient PORT left over from the shell (or a prior test) could
    // throw before NODE_ENV/API_KEY are ever consulted, breaking these
    // tests for a reason unrelated to what they're actually checking.
    // Clearing it here makes the suite hermetic against that.
    originalPort = process.env.PORT;
    delete process.env.PORT;
    // typeof undefined !== 'function', so this exercises the same
    // "unavailable" path the real guard checks for.
    process.loadEnvFile = undefined;
  });

  afterEach(() => {
    process.loadEnvFile = originalLoadEnvFile;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalApiKey === undefined) delete process.env.API_KEY;
    else process.env.API_KEY = originalApiKey;
    if (originalPort === undefined) delete process.env.PORT;
    else process.env.PORT = originalPort;
    delete require.cache[configPath];
  });

  test('boots fine under NODE_ENV=test instead of crashing on the missing loadEnvFile', () => {
    process.env.NODE_ENV = 'test';
    assert.doesNotThrow(() => freshRequireConfig());
  });

  test('still fails fast with the API_KEY message, not a TypeError about loadEnvFile', () => {
    delete process.env.NODE_ENV;
    delete process.env.API_KEY;

    assert.throws(
      () => freshRequireConfig(),
      (err) => {
        assert.equal(err instanceof TypeError, false, 'must not be the loadEnvFile TypeError regression');
        assert.match(err.message, /missing required environment variable: API_KEY/);
        return true;
      }
    );
  });
});
