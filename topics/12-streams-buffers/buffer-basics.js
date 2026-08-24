// Buffer basics: raw binary data, encodings, concatenation, and slicing.
// Buffers are how Node represents binary data — file contents, network
// packets, image bytes — anything that isn't inherently text.
//
// Run: node buffer-basics.js
console.log('--- creating buffers ---');
const fromString = Buffer.from('hello', 'utf-8');
const fromArray = Buffer.from([0x68, 0x69]); // raw byte values -> "hi"
const allocated = Buffer.alloc(4); // 4 zero-filled bytes

console.log('fromString:', fromString, '->', fromString.toString());
console.log('fromArray:', fromArray, '->', fromArray.toString());
console.log('allocated (zero-filled):', allocated);

console.log('\n--- encodings change how bytes map to text, not the bytes themselves ---');
const utf8Buf = Buffer.from('café', 'utf-8');
console.log('byte length of "café" in utf-8:', utf8Buf.length, '(é takes 2 bytes)');
console.log('as hex:', utf8Buf.toString('hex'));
console.log('as base64:', utf8Buf.toString('base64'));
console.log('decoded back:', Buffer.from(utf8Buf.toString('base64'), 'base64').toString('utf-8'));

console.log('\n--- concatenation ---');
const part1 = Buffer.from('Hello, ');
const part2 = Buffer.from('World!');
const combined = Buffer.concat([part1, part2]);
console.log('combined:', combined.toString());

console.log('\n--- slicing (subarray shares the same underlying memory — no copy) ---');
const original = Buffer.from('abcdefgh');
const slice = original.subarray(2, 5);
console.log('slice:', slice.toString());
slice[0] = 'X'.charCodeAt(0);
console.log('mutating the slice also mutates the original:', original.toString());

console.log('\n--- comparing and checking contents ---');
console.log('Buffer.compare(a, b):', Buffer.compare(Buffer.from('a'), Buffer.from('b')));
console.log('buffer.equals():', Buffer.from('same').equals(Buffer.from('same')));
