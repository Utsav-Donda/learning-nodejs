// Compares Promise.all, Promise.allSettled, and Promise.race for running
// multiple async operations concurrently.
//
// Run: node promise-combinators.js

function delay(ms, value, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(`task "${value}" failed`));
      else resolve(value);
    }, ms);
  });
}

async function demoAll() {
  console.log('\n--- Promise.all (fails fast on first rejection) ---');
  try {
    const results = await Promise.all([
      delay(30, 'a'),
      delay(10, 'b'),
      delay(20, 'c'),
    ]);
    console.log('all succeeded:', results);
  } catch (err) {
    console.error('all rejected because one task failed:', err.message);
  }
}

async function demoAllRejects() {
  console.log('\n--- Promise.all with one failing task ---');
  try {
    await Promise.all([delay(10, 'ok'), delay(5, 'bad', true)]);
  } catch (err) {
    // The whole batch rejects even though "ok" would have succeeded.
    console.error('caught:', err.message);
  }
}

async function demoAllSettled() {
  console.log('\n--- Promise.allSettled (waits for every task, never rejects) ---');
  const results = await Promise.allSettled([
    delay(10, 'ok-1'),
    delay(5, 'bad', true),
    delay(15, 'ok-2'),
  ]);
  for (const result of results) {
    if (result.status === 'fulfilled') console.log('fulfilled:', result.value);
    else console.log('rejected:', result.reason.message);
  }
}

async function demoRace() {
  console.log('\n--- Promise.race (settles as soon as ANY task settles) ---');
  const winner = await Promise.race([delay(50, 'slow'), delay(10, 'fast')]);
  console.log('first to settle:', winner);
}

async function main() {
  await demoAll();
  await demoAllRejects();
  await demoAllSettled();
  await demoRace();
}

main();
