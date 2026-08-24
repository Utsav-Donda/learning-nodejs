// Exercise 2 solution: generate and process a large file using streams
// end to end, so memory usage stays roughly constant no matter how big
// the file gets — the opposite of fs.readFileSync-ing the whole thing
// into memory first.
//
// Run: node large-file-pipeline.js
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const filePath = path.join(__dirname, '.scratch-large-file.txt');
const LINE_COUNT = 200_000;

// Writes LINE_COUNT lines to disk, respecting backpressure: when
// write() returns false, the internal buffer is full and we must wait
// for 'drain' before writing more, or memory would grow unbounded as
// we out-produce what the OS can flush to disk.
function generateFile() {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    let i = 0;

    function writeNext() {
      let canContinue = true;
      while (i < LINE_COUNT && canContinue) {
        i += 1;
        canContinue = writeStream.write(`line ${i} — some sample content for size\n`);
      }

      if (i >= LINE_COUNT) {
        writeStream.end();
      } else {
        // Buffer is full — pause until the stream signals it has
        // caught up, instead of piling more writes into memory.
        writeStream.once('drain', writeNext);
      }
    }

    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
    writeNext();
  });
}

// Counts lines with a streaming readline interface — at no point is the
// full file content held in memory at once.
function countLines(path) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      crlfDelay: Infinity,
    });

    let count = 0;
    rl.on('line', () => { count += 1; });
    rl.on('close', () => resolve(count));
    rl.on('error', reject);
  });
}

async function main() {
  // Pin the locale explicitly — toLocaleString() with no argument uses
  // the host machine's default locale, so output would otherwise vary
  // (e.g. "2,00,000" under an en-IN locale vs "200,000" under en-US).
  console.log(`generating a file with ${LINE_COUNT.toLocaleString('en-US')} lines...`);
  await generateFile();

  const stats = await fs.promises.stat(filePath);
  console.log(`file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  const before = process.memoryUsage().heapUsed;
  const lineCount = await countLines(filePath);
  const after = process.memoryUsage().heapUsed;

  console.log(`counted ${lineCount.toLocaleString('en-US')} lines`);
  console.log(`heap growth while counting: ${((after - before) / 1024).toFixed(1)} KB`);
  console.log('(stays small regardless of file size — the whole file was never loaded at once)');

  await fs.promises.rm(filePath, { force: true });
}

main().catch((err) => {
  console.error('failed:', err);
  process.exitCode = 1;
});
