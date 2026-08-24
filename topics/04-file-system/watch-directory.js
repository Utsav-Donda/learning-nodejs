// Exercise 2 solution: watch a directory and log a message whenever a
// file inside it changes. fs.watch's behavior (event names, whether
// renames fire 'rename' or 'change') varies by OS — this demo treats
// both event types the same way, which is portable and usually enough.
//
// Run: node watch-directory.js [dir]   (defaults to a fresh ./watched-tmp)
// Then, in another terminal: echo hello >> watched-tmp/test.txt
// Stop with Ctrl+C.
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const targetDir = process.argv[2] || path.join(__dirname, 'watched-tmp');
  await fsp.mkdir(targetDir, { recursive: true });

  console.log(`Watching ${targetDir} for changes... (Ctrl+C to stop)`);

  const watcher = fs.watch(targetDir, (eventType, filename) => {
    // eventType is 'change' or 'rename' (create/delete/rename all
    // surface as 'rename' on most platforms).
    console.log(`[${new Date().toISOString()}] ${eventType}: ${filename ?? '(unknown file)'}`);
  });

  process.on('SIGINT', () => {
    console.log('\nstopping watcher');
    watcher.close();
    process.exit(0);
  });
}

main();
