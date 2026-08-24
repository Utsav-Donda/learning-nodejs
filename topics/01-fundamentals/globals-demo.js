// Explores Node's global objects that don't exist in browser JS:
// process, __dirname, __filename, and Buffer.
//
// Run: node globals-demo.js some-arg --flag=value

console.log('--- process ---');
console.log('argv:', process.argv); // [execPath, scriptPath, ...userArgs]
console.log('platform:', process.platform);
console.log('node version:', process.version);
console.log('cwd:', process.cwd());
console.log('env.PATH is set:', typeof process.env.PATH === 'string');

console.log('\n--- module-scoped globals (CommonJS only) ---');
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);

console.log('\n--- Buffer (binary data) ---');
const buf = Buffer.from('hello node', 'utf-8');
console.log('buffer bytes:', buf);
console.log('buffer as string:', buf.toString('utf-8'));
console.log('buffer length:', buf.length, 'bytes');

console.log('\n--- graceful shutdown hook ---');
process.on('exit', (code) => {
  // Only synchronous work is allowed here — the event loop is already
  // stopping by the time this fires.
  console.log(`process exiting with code ${code}`);
});
