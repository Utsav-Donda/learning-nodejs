// CommonJS module: uses require()/module.exports, loaded synchronously.
function greet(name) {
  return `Hello, ${name}, from a CommonJS module!`;
}

module.exports = { greet };
