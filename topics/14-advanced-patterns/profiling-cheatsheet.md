# Profiling Cheatsheet

Ways to find out *why* a Node.js app is slow, using [`profiling-target.js`](profiling-target.js) as something to point each tool at.

## 1. Built-in CPU profiler (`--cpu-prof`)

No extra tooling needed — Node can write a CPU profile directly.

```bash
node --cpu-prof --cpu-prof-name=profile.cpuprofile profiling-target.js
# in another terminal, generate load:
for i in $(seq 1 5); do curl "http://localhost:3000/?n=35"; done
# stop the server with Ctrl+C — profile.cpuprofile is written on exit
```

The profile file is only written on a clean process exit — stop the server with Ctrl+C (or `process.exit()`), not by force-killing it. A forceful kill (e.g. `kill -9`, or Windows' `taskkill /F`) skips the flush and no file gets written.

Open the resulting `.cpuprofile` file in Chrome DevTools: go to `chrome://inspect`, click **Open dedicated DevTools for Node**, then the **Profiler**/**Performance** tab → **Load profile**.

## 2. Live profiling with `--inspect` + Chrome DevTools

Attach a debugger/profiler to a *running* process instead of writing a file upfront.

```bash
node --inspect profiling-target.js
```

Then open `chrome://inspect` in Chrome, click **inspect** under the Node target, and use the **Profiler** tab to start/stop recording while you generate load with curl. This is the best option for profiling a specific window of time in a long-running process, rather than the whole process lifetime.

## 3. The legacy V8 profiler (`--prof`)

Older, lower-level flag — still useful when you can't attach Chrome DevTools (e.g. profiling a remote server over SSH).

```bash
node --prof profiling-target.js
# generate load, then stop the server (Ctrl+C)
# this writes a isolate-0x...-v8.log file in the cwd
node --prof-process isolate-*-v8.log > processed.txt
```

`processed.txt` is a plain-text summary — look at the "Summary" section for the percentage of ticks spent in JavaScript vs C++ vs GC, and "Bottom up (heavy) profile" for which functions actually consumed the time.

## 4. `clinic.js` (third-party, more detailed reports)

[Clinic.js](https://clinicjs.org/) wraps profiling into an HTML flamegraph, no manual Chrome DevTools steps needed. Not installed in this repo (it's a devDependency-only tool you'd add per-project) — try it with `npx`:

```bash
npx clinic flame -- node profiling-target.js
# generate load, then Ctrl+C — an HTML report opens automatically
```

## What to look for

- **A tall, narrow tower in the flamegraph** — one function dominating CPU time (in `profiling-target.js`'s case, `fibonacci`, deliberately).
- **A wide, flat profile with no clear peak** — often means the bottleneck is I/O-bound (waiting on a DB/network), not CPU-bound — a CPU profiler won't show much useful signal for that; look at request timing/tracing instead.
- **Excessive time in "GC" (garbage collection)** — usually means too many short-lived object allocations; look for object creation inside hot loops.
