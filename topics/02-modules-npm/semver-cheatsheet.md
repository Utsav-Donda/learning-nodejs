# Semantic Versioning Cheatsheet

npm packages are versioned `MAJOR.MINOR.PATCH` (e.g. `4.18.2`):

- **MAJOR** — breaking changes
- **MINOR** — new backwards-compatible features
- **PATCH** — backwards-compatible bug fixes

## Range prefixes in `package.json`

| Range | Meaning | Example matches |
|---|---|---|
| `4.18.2` | Exact version only | `4.18.2` |
| `^4.18.2` | Compatible within the same major | `4.18.3`, `4.99.0` — not `5.0.0` |
| `~4.18.2` | Compatible within the same minor | `4.18.3` — not `4.19.0` |
| `>=4.18.2` | Any version greater or equal | `4.18.2`, `5.0.0`, ... |
| `*` or `latest` | Any version (avoid in real projects) | anything |

`^` is npm's default when you run `npm install <pkg>` and is the right choice for most dependencies — it takes patch and minor updates but never a breaking major bump.

## Lockfiles

`package-lock.json` pins the *exact* resolved version (and its whole dependency tree) that was installed, regardless of the ranges in `package.json`. Always commit it.

- `npm install` — respects `package.json` ranges, may update the lockfile.
- `npm ci` — installs *exactly* what's in the lockfile, deleting `node_modules` first. Use this in CI for reproducible builds.

## Useful commands

```bash
npm outdated          # see which deps have newer versions available
npm update             # update within the ranges already in package.json
npm view express versions   # list all published versions of a package
npm ls express         # show the resolved version + why it's installed
```
