# 12 — Streams & Buffers

## Overview

Node's streaming primitives for handling data efficiently, especially at scale.

## Learning Objectives

- Understand `Buffer` and binary data handling.
- Use readable, writable, duplex, and transform streams.
- Pipe streams together and handle backpressure.
- Apply streams to a practical case (e.g. processing a large file).

## Key Concepts

- [ ] `Buffer` basics
- [ ] Readable/Writable/Duplex/Transform streams
- [ ] `.pipe()` and backpressure
- [ ] `stream/promises` (`pipeline`)

## Examples

- [`buffer-basics.js`](buffer-basics.js) — creating buffers, encodings (utf-8/hex/base64), concatenation, and why slicing shares memory with the original buffer instead of copying it.
- [`transform-stream-demo.js`](transform-stream-demo.js) — a custom `Transform` stream that uppercases text, connected with `stream/promises`' `pipeline()` for automatic error propagation and cleanup (exercise 1 solution).
- [`large-file-pipeline.js`](large-file-pipeline.js) — generates a 200,000-line file while respecting backpressure (`write()`'s return value + the `'drain'` event), then counts its lines with a streaming `readline` interface and reports heap growth to show memory stays roughly flat regardless of file size (exercise 2 solution).

Run any of them with `node <file>.js` — each cleans up its own scratch files when it finishes.

## Exercises

1. Write a Transform stream that uppercases text as it flows through, and pipe a file through it.
2. Process a large file (e.g. line counting) using streams instead of loading it fully into memory.

## Resources

- [Node.js docs — Stream](https://nodejs.org/api/stream.html)
