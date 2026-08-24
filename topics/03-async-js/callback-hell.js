// Simulates three dependent async steps using error-first callbacks,
// the classic pattern that motivated promises and async/await.
//
// Run: node callback-hell.js

function delay(ms, cb) {
  setTimeout(cb, ms);
}

function fetchUser(id, cb) {
  delay(50, () => {
    if (id <= 0) return cb(new Error('invalid user id'));
    cb(null, { id, name: 'Ada Lovelace' });
  });
}

function fetchOrders(userId, cb) {
  delay(50, () => cb(null, [{ id: 1, total: 42 }, { id: 2, total: 17 }]));
}

function fetchOrderDetails(orderId, cb) {
  delay(50, () => cb(null, { id: orderId, status: 'shipped' }));
}

// Each step nests inside the previous callback — the "pyramid of doom".
// Notice error handling has to be repeated at every level.
fetchUser(1, (err, user) => {
  if (err) return console.error('fetchUser failed:', err.message);

  fetchOrders(user.id, (err, orders) => {
    if (err) return console.error('fetchOrders failed:', err.message);

    fetchOrderDetails(orders[0].id, (err, details) => {
      if (err) return console.error('fetchOrderDetails failed:', err.message);

      console.log('user:', user);
      console.log('orders:', orders);
      console.log('first order details:', details);
    });
  });
});

module.exports = { fetchUser, fetchOrders, fetchOrderDetails, delay };
