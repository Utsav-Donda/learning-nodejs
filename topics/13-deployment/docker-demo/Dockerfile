# A production-oriented Dockerfile for a small Node.js/Express app.
#
# Build: docker build -t docker-demo .
# Run:   docker run --rm -p 3000:3000 docker-demo
# Then:  curl http://localhost:3000/health

# Alpine keeps the image small. Using an exact tag instead of
# "node:latest" avoids the worst case (an unpredictable major version
# jump), but "node:22-alpine" still floats across patch releases of
# Node and Alpine — for byte-for-byte reproducible builds, pin an exact
# version or digest instead, e.g. node:22.14.0-alpine or
# node@sha256:<digest>.
FROM node:22-alpine

WORKDIR /app

# Copy only the manifest files first so Docker can cache the
# `npm ci` layer — it only re-runs when package*.json actually changes,
# not on every source code edit.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Now copy the rest of the source.
COPY . .

# The official Node images already include a non-root "node" user —
# use it instead of running the app as root inside the container.
USER node

# Single source of truth for the port, referenced below by both EXPOSE
# and HEALTHCHECK. If you override it, it MUST be a real, fixed port —
# e.g. `docker run -e PORT=8080 -p 8080:8080 ...` (updating -p to match
# is required too, or the host can't reach the new port). Unlike the
# bare-metal/PM2 case, PORT=0 ("let the OS pick a free port") doesn't
# make sense here: EXPOSE/HEALTHCHECK/port-publishing all need a port
# that's known ahead of time, not one discovered after the app starts.
#
# Note: EXPOSE is resolved once at build time (it's documentation
# metadata for `docker run -P` and image inspection, not a live setting)
# — a `docker run -e PORT=8080` override changes what the app actually
# listens on and what HEALTHCHECK checks (which reads the live env var
# at container-run time), but the image's baked-in EXPOSE metadata
# still reports 3000. Rebuild the image with a different ENV PORT if
# you want EXPOSE itself to change.
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE $PORT

# Lets `docker ps` and orchestrators see container health, not just
# "the process hasn't exited" — matches the /health route in app.js.
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

CMD ["node", "app.js"]
