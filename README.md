# Learning Node.js 🚀

A structured, self-paced curriculum for learning Node.js from the ground up — core fundamentals through advanced backend patterns. This repo is my personal learning log: notes, runnable examples, exercises, and small projects, organized by topic so progress is easy to track.

## Goals

- Build a solid mental model of the Node.js runtime (event loop, modules, streams, async I/O).
- Get comfortable with the core APIs before reaching for frameworks.
- Practice by building real, runnable examples — not just reading theory.
- Ship a few small end-to-end projects (CLI tools, REST APIs, a real-time app) to cement the concepts.

## Prerequisites

- Basic JavaScript (variables, functions, closures, ES6+ syntax, promises).
- [Node.js](https://nodejs.org/) installed — LTS version recommended (see [.nvmrc](.nvmrc)).
- A code editor (VS Code recommended) and basic command line familiarity.

## Curriculum / Roadmap

Each topic lives in its own folder under [topics/](topics/) with a README (concepts + notes), runnable code examples, and exercises.

| # | Topic | Status |
|---|-------|--------|
| 01 | [Fundamentals & the Runtime](topics/01-fundamentals) — event loop, globals, `process`, CommonJS vs ESM | ⬜ Not started |
| 02 | [Modules & npm](topics/02-modules-npm) — `require`/`import`, package.json, semver, npm scripts | ⬜ Not started |
| 03 | [Asynchronous JavaScript](topics/03-async-js) — callbacks, promises, async/await, error handling | ⬜ Not started |
| 04 | [File System](topics/04-file-system) — `fs` module, paths, sync vs async, watching files | ⬜ Not started |
| 05 | [HTTP Servers](topics/05-http-servers) — the `http` module, routing by hand, request/response | ⬜ Not started |
| 06 | [Express.js](topics/06-express) — routing, middleware, error handling, templating | ⬜ Not started |
| 07 | [Databases](topics/07-databases) — SQL (Postgres) and NoSQL (MongoDB), ORMs/drivers | ⬜ Not started |
| 08 | [Authentication](topics/08-authentication) — sessions, JWT, OAuth basics, password hashing | ⬜ Not started |
| 09 | [Testing](topics/09-testing) — unit/integration tests with Jest or Node's test runner, mocking | ⬜ Not started |
| 10 | [REST APIs](topics/10-rest-apis) — API design, validation, versioning, status codes | ⬜ Not started |
| 11 | [WebSockets & Real-time](topics/11-websockets) — `ws`, Socket.IO, pub/sub patterns | ⬜ Not started |
| 12 | [Streams & Buffers](topics/12-streams-buffers) — readable/writable/duplex streams, backpressure | ⬜ Not started |
| 13 | [Deployment](topics/13-deployment) — environment config, process managers, Docker, CI/CD basics | ⬜ Not started |
| 14 | [Advanced Patterns](topics/14-advanced-patterns) — worker threads, clustering, performance, security | ⬜ Not started |

Update the status column (⬜ Not started / 🟨 In progress / ✅ Done) as topics are completed.

## Repo Structure

```
learning-nodejs/
├── topics/           # One folder per topic — notes + runnable examples + exercises
├── projects/         # Larger end-to-end projects that combine multiple topics
├── resources/         # Curated links, cheatsheets, books, courses
└── .github/           # Issue/PR templates and community health files
```

## Projects

Bigger, end-to-end builds live in [projects/](projects/) once the underlying topics are covered:

- [ ] CLI task manager (fs + streams)
- [ ] REST API with auth (Express + database + JWT)
- [ ] Real-time chat app (WebSockets)
- [ ] Dockerized deployment of the REST API

## Resources

Curated links, docs, and references live in [resources/](resources/README.md).

## Contributing

This is primarily a personal learning repo, but suggestions, corrections, and discussion are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Licensed under the [MIT License](LICENSE).
