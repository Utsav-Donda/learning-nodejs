# 04 — File System

## Overview

Reading, writing, and watching files with Node's built-in `fs` module.

## Learning Objectives

- Use both the callback and promise-based (`fs/promises`) APIs.
- Understand when sync APIs are acceptable (startup scripts) vs when they block the event loop.
- Work with paths portably using the `path` module.
- Watch files/directories for changes.

## Key Concepts

- [ ] `fs.readFile`/`writeFile` vs `fs.readFileSync`/`writeFileSync` vs `fs/promises`
- [ ] `path.join`, `path.resolve`, `__dirname`
- [ ] Directory operations: `readdir`, `mkdir`, `rm`
- [ ] `fs.watch` for file change detection

## Examples

- [`read-write-demo.js`](read-write-demo.js) — writes and reads back a scratch file using the sync, callback, and `fs/promises` APIs side by side.
- [`directory-stats.js`](directory-stats.js) — lists a directory's contents with file sizes (exercise 1 solution).
  `node directory-stats.js [dir]`
- [`watch-directory.js`](watch-directory.js) — watches a folder and logs changes as they happen (exercise 2 solution). Long-running — stop with Ctrl+C.
  `node watch-directory.js [dir]`

## Exercises

1. Write a script that reads a directory and logs file sizes for each file.
2. Build a tiny file watcher that logs a message whenever a file in a folder changes.

## Resources

- [Node.js docs — File system](https://nodejs.org/api/fs.html)
