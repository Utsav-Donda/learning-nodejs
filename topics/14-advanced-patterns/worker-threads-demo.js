// Offloads a CPU-intensive calculation to a worker thread so it
// doesn't block the event loop, and compares that against running the
// same work on the main thread (which visibly blocks a concurrent
// "heartbeat" timer).
//
// Run: node worker-threads-demo.js
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const { fibonacci } = require('./fibonacci.js');

if (isMainThread) {
  const N = 40;

  function startHeartbeat(message) {
    let count = 0;
    return setInterval(() => console.log(`  (heartbeat ${++count} — ${message})`), 200);
  }

  async function runOnMainThread() {
    console.log(`\n--- running fib(${N}) directly on the main thread ---`);
    const heartbeat = startHeartbeat('but nothing else can run until fib finishes');

    const start = Date.now();
    const result = fibonacci(N);
    clearInterval(heartbeat);
    console.log(`main-thread result: ${result} in ${Date.now() - start}ms — heartbeat was frozen the whole time`);
  }

  function runInWorker() {
    return new Promise((resolve, reject) => {
      console.log(`\n--- running fib(${N}) in a worker thread ---`);
      const heartbeat = startHeartbeat('main thread stays responsive');

      const start = Date.now();

      let worker;
      try {
        // __filename re-runs this same file, but as a worker this
        // time — the isMainThread check below routes it to the worker
        // branch. The constructor can throw synchronously (e.g. thread
        // creation exhaustion, invalid execArgv) — without this catch,
        // that would skip every handler below and leave the heartbeat
        // interval started above running forever.
        worker = new Worker(__filename, { workerData: { n: N } });
      } catch (err) {
        clearInterval(heartbeat);
        reject(err);
        return;
      }

      // clearInterval is safe to call more than once, so each handler
      // clears it independently rather than relying on exactly one of
      // these three events firing — 'exit' in particular can fire on
      // its own (e.g. after worker.terminate(), or a native/OOM crash)
      // without 'error' firing first, and a heartbeat interval left
      // running keeps the process alive indefinitely since it's never
      // unref()'d.
      worker.on('message', (result) => {
        clearInterval(heartbeat);
        console.log(`worker result: ${result} in ${Date.now() - start}ms`);
        resolve(result);
      });

      worker.on('error', (err) => {
        clearInterval(heartbeat);
        reject(err);
      });

      worker.on('exit', (code) => {
        clearInterval(heartbeat);
        if (code !== 0) reject(new Error(`worker stopped with exit code ${code}`));
      });
    });
  }

  async function main() {
    await runOnMainThread();
    await runInWorker();
  }

  main().catch((err) => {
    console.error('demo failed:', err);
    process.exitCode = 1;
  });
} else {
  // This branch only runs inside the worker thread spawned above.
  const result = fibonacci(workerData.n);
  parentPort.postMessage(result);
}
