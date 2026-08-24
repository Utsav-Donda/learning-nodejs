// The same flow again, this time with async/await — the most readable
// form, since it looks like synchronous code. Error handling uses a
// plain try/catch instead of .catch().
//
// Run: node async-await-errors.js

// Note: requiring promise-chaining.js also runs its own top-level demo
// (the "user:/orders:/first order details:" lines below come from that
// file executing, not from this one) — that's a side effect of reusing
// its functions rather than something to imitate in real code.
const { fetchUser, fetchOrders, fetchOrderDetails } = require('./promise-chaining.js');

async function loadUserSummary(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const details = await fetchOrderDetails(orders[0].id);
    return { user, orders, details };
  } catch (err) {
    // Any rejected await inside the try block lands here.
    throw new Error(`loadUserSummary failed: ${err.message}`);
  }
}

async function main() {
  const summary = await loadUserSummary(1);
  console.log('summary:', summary);

  // Demonstrate the error path with an invalid id.
  try {
    await loadUserSummary(-1);
  } catch (err) {
    console.error('expected failure caught:', err.message);
  }
}

// A common pitfall: forgetting to await/catch a top-level async call
// produces an "unhandled promise rejection". Guarding main() like this
// avoids that.
main().catch((err) => {
  console.error('unexpected error in main:', err);
  process.exitCode = 1;
});
