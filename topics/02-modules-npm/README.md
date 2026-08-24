# 02 — Modules & npm

## Overview

Organizing code into modules and managing dependencies with npm.

## Learning Objectives

- Write and consume both CommonJS and ES modules.
- Understand `package.json` fields (`main`, `type`, `scripts`, `dependencies` vs `devDependencies`).
- Understand semantic versioning (`^`, `~`, exact pins) and lockfiles.
- Use npm scripts to automate common tasks.

## Key Concepts

- [ ] Module resolution (relative paths, `node_modules`, built-in modules)
- [ ] `package.json` and `package-lock.json`
- [ ] Semver ranges
- [ ] `npm install`, `npm ci`, `npm run`, `npx`
- [ ] Publishing a package (overview)

## Examples

- [`local-module/`](local-module/) — a two-file CommonJS project (`math.js` exporting functions, consumed by `index.js`).
  `node local-module/index.js`
- [`esm-module-demo/`](esm-module-demo/) — a nested `package.json` with `"type": "module"`, showing how ESM can be scoped to a subfolder independent of the repo root.
  `cd esm-module-demo && npm start`
- [`semver-cheatsheet.md`](semver-cheatsheet.md) — quick reference for version ranges (`^`, `~`, exact) and lockfile commands.

## Exercises

1. Create a two-file project where one module exports functions consumed by another.
2. Add custom npm scripts (`lint`, `start`, `dev`) to a `package.json` and run them with `npm run`.

## Resources

- [npm docs — About package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
