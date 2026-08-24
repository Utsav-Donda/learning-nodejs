# A production-oriented Dockerfile for a small Node.js/Express app.
#
# Build: docker build -t docker-demo .
# Run:   docker run --rm -p 3000:3000 docker-demo
# Then:  curl http://localhost:3000/health

# Alpine keeps the image small; pin an exact LTS line rather than
# "node:latest" so builds are reproducible.
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

ENV NODE_ENV=production
EXPOSE 3000

# Lets `docker ps` and orchestrators see container health, not just
# "the process hasn't exited" — matches the /health route in app.js.
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
