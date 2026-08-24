# Contributing

Thanks for taking an interest in this repo! It's primarily a personal Node.js learning log, but corrections, suggestions, and discussion are genuinely welcome — especially if something in the notes is inaccurate or could be explained better.

## Ways to contribute

- **Spot an error?** Open an issue describing what's wrong and where (file + line if possible), or open a PR with the fix directly.
- **Have a better example or explanation?** PRs improving existing topic notes/examples are welcome.
- **Suggest a topic** that's missing from the curriculum via an issue using the "Learning question / suggestion" template.

## Making a change

1. Fork the repo and create a branch from `main`:
   `git checkout -b fix/short-description`
2. Make your change. Keep examples runnable — if you add code, make sure it actually executes with the Node version in [.nvmrc](.nvmrc).
3. If you touched a topic folder, keep its `README.md` and code examples in sync.
4. Commit with a clear message and open a pull request describing the change and why it helps.

## Style notes

- Keep examples small and focused on the concept being taught — avoid unrelated abstractions.
- Prefer plain, runnable Node.js scripts over pseudo-code.
- Use `const`/`let`, modern async/await, and add comments only where the *why* isn't obvious from the code.

## Code of Conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive.
