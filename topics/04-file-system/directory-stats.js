// Exercise 1 solution: read a directory and log the size of each file
// in it, using path.join for portable path construction.
//
// Run: node directory-stats.js [dir]   (defaults to this topic's folder)
const fsp = require('node:fs/promises');
const path = require('node:path');

async function reportDirectory(dirPath) {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });

  console.log(`Contents of ${dirPath}:\n`);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      console.log(`  [dir]  ${entry.name}/`);
      continue;
    }

    const stats = await fsp.stat(fullPath);
    console.log(`  [file] ${entry.name} — ${stats.size} bytes`);
  }
}

const targetDir = process.argv[2] || __dirname;

reportDirectory(targetDir).catch((err) => {
  console.error('failed to read directory:', err.message);
  process.exitCode = 1;
});
