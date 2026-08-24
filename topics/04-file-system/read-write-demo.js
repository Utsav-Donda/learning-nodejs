// Compares the three flavors of the fs API: sync, callback-based, and
// promise-based (fs/promises) — for a simple write-then-read round trip.
//
// Run: node read-write-demo.js
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const scratchFile = path.join(__dirname, '.scratch-demo.txt');

function syncDemo() {
  console.log('\n--- sync API (blocks the event loop until done) ---');
  fs.writeFileSync(scratchFile, 'written synchronously\n');
  const content = fs.readFileSync(scratchFile, 'utf-8');
  console.log('read back:', content.trim());
}

function callbackDemo(done) {
  console.log('\n--- callback API (non-blocking, error-first callback) ---');
  fs.writeFile(scratchFile, 'written via callback\n', (err) => {
    if (err) return done(err);
    fs.readFile(scratchFile, 'utf-8', (err, content) => {
      if (err) return done(err);
      console.log('read back:', content.trim());
      done();
    });
  });
}

async function promiseDemo() {
  console.log('\n--- fs/promises API (non-blocking, async/await friendly) ---');
  await fsp.writeFile(scratchFile, 'written via fs/promises\n');
  const content = await fsp.readFile(scratchFile, 'utf-8');
  console.log('read back:', content.trim());
}

async function main() {
  syncDemo();

  await new Promise((resolve, reject) => {
    callbackDemo((err) => (err ? reject(err) : resolve()));
  });

  await promiseDemo();

  // Clean up the scratch file we created.
  await fsp.rm(scratchFile, { force: true });
  console.log('\ncleaned up', scratchFile);
}

main().catch((err) => {
  console.error('demo failed:', err);
  process.exitCode = 1;
});
