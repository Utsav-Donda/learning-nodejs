// ES module: uses import/export, loaded asynchronously.
// The .mjs extension forces Node to treat this file as ESM regardless
// of the nearest package.json's "type" field.
export function greet(name) {
  return `Hello, ${name}, from an ES module!`;
}
