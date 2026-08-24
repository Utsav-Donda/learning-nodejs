// Demonstrates the relative ordering of the event loop's scheduling
// mechanisms: synchronous code, microtasks (Promises, process.nextTick),
// and macrotasks (setTimeout, setImmediate).
//
// Run: node event-loop-order.js

console.log('1: synchronous code runs first');

setTimeout(() => {
  console.log('5: setTimeout (macrotask, timers phase)');
}, 0);

setImmediate(() => {
  console.log('6: setImmediate (macrotask, check phase)');
});

Promise.resolve().then(() => {
  console.log('3: Promise.then (microtask)');
});

process.nextTick(() => {
  console.log('2: process.nextTick (runs before other microtasks)');
});

queueMicrotask(() => {
  console.log('4: queueMicrotask (microtask, after nextTick queue)');
});

console.log('1.5: still synchronous code');

// Expected order (synchronous code always finishes first, then all
// nextTick callbacks, then all other microtasks, then macrotasks):
//
//   1: synchronous code runs first
//   1.5: still synchronous code
//   2: process.nextTick (runs before other microtasks)
//   3: Promise.then (microtask)
//   4: queueMicrotask (microtask, after nextTick queue)
//   5: setTimeout (macrotask, timers phase)
//   6: setImmediate (macrotask, check phase)
//
// Note: the relative order of setTimeout(fn, 0) vs setImmediate is only
// guaranteed when both are scheduled from within an I/O callback — at the
// top level it can vary by a few microseconds of timer drift.
