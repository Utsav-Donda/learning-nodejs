// Because the sibling package.json sets "type": "module", this plain
// .js file is parsed as an ES module — no .mjs extension needed here.
export function shout(text) {
  return `${text.toUpperCase()}!`;
}
