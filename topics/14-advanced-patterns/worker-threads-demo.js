// Offloads a CPU-intensive calculation to a worker thread so it
// doesn't block the event loop, and compares that against running the
// same work on the main thread (which visibly blocks a concurrent
// "heartbeat" timer).
//
// Run: node worker-threads-demo.js
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

// A deliberately slow, synchronous CPU-bound function — the kind of
// work that would freeze an HTTP server's event loop if run inline.
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

if (isMainThread) {
  const N = 40;

  async function runOnMainThread() {
    console.log(`\n--- running fib(${N}) directly on the main thread ---`);
    let heartbeats = 0;
    const heartbeat = setInterval(() => console.log(`  (heartbeat ${++heartbeats} — but nothing else can run until fib finishes)`), 200);

    const start = Date.now();
    const result = fibonacci(N);
    clearInterval(heartbeat);
    console.log(`main-thread result: ${result} in ${Date.now() - start}ms — heartbeat was frozen the whole time`);
  }

  function runInWorker() {
    return new Promise((resolve, reject) => {
      console.log(`\n--- running fib(${N}) in a worker thread ---`);
      let heartbeats = 0;
      const heartbeat = setInterval(() => console.log(`  (heartbeat ${++heartbeats} — main thread stays responsive)`), 200);

      const start = Date.now();
      // __filename re-runs this same file, but as a worker this time —
      // the isMainThread check below routes it to the worker branch.
      const worker = new Worker(__filename, { workerData: { n: N } });

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
