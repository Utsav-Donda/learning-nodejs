// Exercise 1 solution: a custom Transform stream that uppercases text
// as it flows through, piped from an input file to an output file.
//
// Run: node transform-stream-demo.js
const fs = require('node:fs');
const path = require('node:path');
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const inputPath = path.join(__dirname, '.scratch-input.txt');
const outputPath = path.join(__dirname, '.scratch-output.txt');

class UppercaseTransform extends Transform {
  // _transform is called once per chunk as data flows through — chunks
  // arrive as Buffers by default, which is why we call .toString() here.
  _transform(chunk, encoding, callback) {
    const upper = chunk.toString().toUpperCase();
    this.push(upper);
    callback(); // signal this chunk is done, ready for the next one
  }
}

async function main() {
  await fs.promises.writeFile(inputPath, 'hello streams\nthis text will be uppercased\nline by line\n');

  // pipeline() connects readable -> transform -> writable, and — unlike
  // manually chaining .pipe() calls — automatically propagates errors
  // and cleans up (destroys) every stream if any one of them fails.
  await pipeline(
    fs.createReadStream(inputPath),
    new UppercaseTransform(),
    fs.createWriteStream(outputPath)
  );

  const result = await fs.promises.readFile(outputPath, 'utf-8');
  console.log('output file contents:\n' + result);

  await fs.promises.rm(inputPath, { force: true });
  await fs.promises.rm(outputPath, { force: true });
}

main().catch((err) => {
  console.error('pipeline failed:', err);
  process.exitCode = 1;
});
