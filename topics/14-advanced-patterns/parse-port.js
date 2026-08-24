// A standalone, side-effect-free helper — shared by cluster-demo.js,
// graceful-shutdown-demo.js, and profiling-target.js, which are all
// siblings in this same directory (no build-context constraint like
// topic 13's docker-demo/ forcing a separate copy there).
function parsePort(value, fallback) {
  if (value === undefined || value === null) return fallback;

  // Restricting to string/number up front — rather than coercing
  // anything through String()/Number() — closes off a whole family of
  // JS coercion quirks at once instead of chasing them one at a time:
  // Number(null) === 0, Number([]) === 0, String([]) === '', etc. would
  // otherwise let an unexpected type silently pass as a "valid" port or
  // get misread as "unset", instead of hitting this function's own
  // clear "invalid PORT" error below.
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`invalid PORT: ${JSON.stringify(value)}`);
  }

  // Unset ("PORT=" — empty) or whitespace-only ("PORT= ") both fall
  // back to the default. PORT=0 (a real convention meaning "let the OS
  // pick a free port") must NOT be treated the same way and
  // overridden, the way the naive `Number(x) || fallback` would do —
  // which is also why an empty string can't just fall through to
  // Number(''), since that evaluates to 0 and would be indistinguishable
  // from an intentional PORT=0.
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return fallback;
    // Bare Number(x) also accepts hex ("0x50"), octal ("0o120"),
    // binary ("0b1010000"), and exponential ("5e1") notation — none of
    // which anyone writing PORT=80 in an env file means to opt into.
    // Requiring plain decimal digits closes that off, consistent with
    // this function's whole point of rejecting anything that isn't
    // unambiguously a port number instead of silently coercing it.
    if (!/^\d+$/.test(trimmed)) {
      throw new Error(`invalid PORT: "${value}"`);
    }
  }

  const parsed = Number(value);
  // Upper-bounded at 65535 (the max TCP port) so an out-of-range value
  // fails here with a clear message instead of reaching
  // server.listen(), which throws a much less obvious RangeError/
  // ERR_SOCKET_BAD_PORT.
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`invalid PORT: "${value}"`);
  }

  return parsed;
}

module.exports = { parsePort };
