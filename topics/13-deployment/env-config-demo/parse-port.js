// A standalone, side-effect-free helper — deliberately its own module
// (not part of config.js) so it can be required without also pulling
// in config.js's startup-time API_KEY validation, which callers that
// only want port parsing (like pm2-demo/app.js) don't need or want.
function parsePort(value, fallback) {
  // Unset (undefined) OR set-but-empty/whitespace-only ("PORT=" or
  // "PORT= ") both fall back to the default. PORT=0 (a real convention
  // meaning "let the OS pick a free port") must NOT be treated the
  // same way and overridden, the way the naive `Number(x) || fallback`
  // would do — which is also why an empty string can't just fall
  // through to Number(''), since both Number('') and Number(' ')
  // evaluate to 0 and would be indistinguishable from an intentional
  // PORT=0.
  if (value === undefined || value.trim() === '') return fallback;
  const parsed = Number(value);
  // Upper-bounded at 65535 (the max TCP port) so an out-of-range value
  // fails here with a clear message instead of reaching
  // server.listen(), which throws a much less obvious RangeError.
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`invalid PORT: "${value}"`);
  }
  return parsed;
}

module.exports = { parsePort };
