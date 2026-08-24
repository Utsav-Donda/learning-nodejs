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

Add runnable examples here, e.g. `buffer-basics.js`, `transform-stream-demo.js`, `large-file-pipeline.js`.

## Exercises

1. Write a Transform stream that uppercases text as it flows through, and pipe a file through it.
2. Process a large file (e.g. line counting) using streams instead of loading it fully into memory.

## Resources

- [Node.js docs — Stream](https://nodejs.org/api/stream.html)
