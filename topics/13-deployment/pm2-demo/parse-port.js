// A standalone, side-effect-free helper — kept in its own module (not
// inline in app.js) so it can be unit-tested in isolation.
//
// Deliberately duplicated from env-config-demo/parse-port.js rather
// than imported: this repo's demos are meant to be copy-paste-able as
// standalone examples (a learner grabbing just the pm2-demo/ folder on
// its own should still work), so reaching across topic directories for
// shared logic would break that even though Node's module resolution
// itself would technically allow it.
function parsePort(value, fallback) {
  // Unset or set-but-empty/whitespace-only ("PORT=" or "PORT= ") both
  // fall back to the default. Number('') and Number(' ') both evaluate
  // to 0, so an empty/blank value can't be allowed to fall through to
  // Number() or it would be indistinguishable from an intentional 0.
  if (value === undefined || value.trim() === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`invalid PORT: "${value}"`);
  }

  return parsed;
}

module.exports = { parsePort };
