// Integration test: spins up a real Express app (reused from topic 06)
// on an ephemeral port and hits it with real HTTP requests via the
// built-in fetch — no mocking, no extra dependency like supertest needed.
//
// Run: node --test api.integration.test.js
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../06-express/basic-app.js');

let server;
let baseUrl;

before(() => {
  return new Promise((resolve) => {
    // Port 0 asks the OS for any free port, so tests never collide with
    // something already listening on 3000.
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

after(() => {
  return new Promise((resolve) => server.close(resolve));
});

describe('GET /users/:id', () => {
  test('returns the requested user', async () => {
    const res = await fetch(`${baseUrl}/users/42`);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.id, '42');
    assert.equal(body.name, 'Ada Lovelace');
  });
});

describe('POST /users', () => {
  test('creates a user when name is provided', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Grace Hopper' }),
    });
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.equal(body.name, 'Grace Hopper');
  });

  test('rejects a missing name with 400', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(res.status, 400);
  });
});
