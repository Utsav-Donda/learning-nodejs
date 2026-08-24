// Demonstrates secure password hashing with bcrypt — never store
// plaintext passwords, and never roll your own hashing scheme.
//
// Run: node password-hashing.js
const bcrypt = require('bcryptjs');

async function main() {
  const plainPassword = 'correct horse battery staple';

  // The "cost factor" (10 here) controls how slow hashing is — higher is
  // more resistant to brute force but slower for legitimate logins too.
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);

  console.log('plaintext password (never store this):', plainPassword);
  console.log('stored hash (safe to store in a database):', hash);

  const validAttempt = await bcrypt.compare('correct horse battery staple', hash);
  const invalidAttempt = await bcrypt.compare('wrong password', hash);

  console.log('\ncorrect password matches hash:', validAttempt);
  console.log('wrong password matches hash:', invalidAttempt);

  // Two hashes of the same password are different because bcrypt salts
  // automatically — this is what prevents identical passwords from
  // producing identical hashes (which would leak that two users share
  // a password).
  const secondHash = await bcrypt.hash(plainPassword, saltRounds);
  console.log('\nsame password, different hash each time:', hash !== secondHash);
}

main();
