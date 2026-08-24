// A standalone, side-effect-free helper — kept in its own module (not
// inline in app.js) so it can be unit-tested without also requiring
// Express and instantiating the whole app just to reach it.
//
// Deliberately duplicated from env-config-demo/parse-port.js rather
// than imported — this app is meant to be self-contained so the
// Dockerfile alongside it can `COPY . .` and build without reaching
// outside this directory (unlike pm2-demo, which isn't
// build-context-constrained and does import the shared helper). This
// copy also differs in one behavior: it rejects PORT=0.
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

  // Unlike bare-metal/PM2 deployments, PORT=0 ("let the OS pick a free
  // port") doesn't make sense for a container: EXPOSE, HEALTHCHECK,
  // and `docker run -p` all need a fixed port known ahead of time, not
  // one discovered after the app starts. Rejecting it here — instead
  // of just documenting it in the Dockerfile — means a misconfigured
  // `docker run -e PORT=0` fails immediately with a clear message
  // instead of silently producing an unreachable, unhealthy container.
  if (parsed === 0) {
    throw new Error('PORT=0 is not supported in the containerized app — set a fixed port instead');
  }

  return parsed;
}

module.exports = { parsePort };
