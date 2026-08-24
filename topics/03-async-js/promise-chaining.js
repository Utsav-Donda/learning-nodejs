// The same three-step flow as callback-hell.js, rewritten with promises.
// Each step is flat (chained with .then) instead of nested, and errors
// are handled once at the end with a single .catch.
//
// Run: node promise-chaining.js

function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function fetchUser(id) {
  return delay(50, null).then(() => {
    if (id <= 0) throw new Error('invalid user id');
    return { id, name: 'Ada Lovelace' };
  });
}

function fetchOrders(userId) {
  return delay(50, [{ id: 1, total: 42 }, { id: 2, total: 17 }]);
}

function fetchOrderDetails(orderId) {
  return delay(50, { id: orderId, status: 'shipped' });
}

let sharedUser;
let sharedOrders;

fetchUser(1)
  .then((user) => {
    sharedUser = user;
    return fetchOrders(user.id);
  })
  .then((orders) => {
    sharedOrders = orders;
    return fetchOrderDetails(orders[0].id);
  })
  .then((details) => {
    console.log('user:', sharedUser);
    console.log('orders:', sharedOrders);
    console.log('first order details:', details);
  })
  .catch((err) => {
    // A single catch handles a failure from ANY step in the chain.
    console.error('chain failed:', err.message);
  });

module.exports = { fetchUser, fetchOrders, fetchOrderDetails, delay };
