// A standalone, side-effect-free helper — shared by cluster-demo.js,
// graceful-shutdown-demo.js, and profiling-target.js, which are all
// siblings in this same directory (no build-context constraint like
// topic 13's docker-demo/ forcing a separate copy there).
function parsePort(value, fallback) {
  // Unset (undefined) OR set-but-empty/whitespace-only ("PORT=" or
  // "PORT= ") both fall back to the default. PORT=0 (a real convention
  // meaning "let the OS pick a free port") must NOT be treated the
  // same way and overridden, the way the naive `Number(x) || fallback`
  // would do — which is also why an empty string can't just fall
  // through to Number(''), since both Number('') and Number(' ')
  // evaluate to 0 and would be indistinguishable from an intentional
  // PORT=0.
  //
  // env vars (this function's only real-world input) are always
  // strings or undefined, never anything else — but String(value)
  // instead of value.trim() means a future caller passing some other
  // type (e.g. a number from a config object) gets this function's
  // clear "invalid PORT" error below instead of an unrelated
  // "value.trim is not a function" TypeError. null is treated the same
  // as undefined ("not provided") rather than falling through to
  // Number(null), which is a JS quirk that evaluates to 0 — that would
  // otherwise silently and incorrectly resolve to the same thing as an
  // explicit PORT=0.
  if (value === undefined || value === null || String(value).trim() === '') return fallback;

  const parsed = Number(value);
  // Upper-bounded at 65535 (the max TCP port) so an out-of-range or
  // non-numeric value fails here with a clear message instead of
  // reaching server.listen(), which throws a much less obvious
  // RangeError/ERR_SOCKET_BAD_PORT.
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`invalid PORT: "${value}"`);
  }

  return parsed;
}

module.exports = { parsePort };
