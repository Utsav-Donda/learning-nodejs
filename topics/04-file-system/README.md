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

Add runnable scripts here, e.g. `read-write-demo.js`, `watch-directory.js`.

## Exercises

1. Write a script that reads a directory and logs file sizes for each file.
2. Build a tiny file watcher that logs a message whenever a file in a folder changes.

## Resources

- [Node.js docs — File system](https://nodejs.org/api/fs.html)
