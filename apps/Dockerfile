# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# Spotlight — NestJS API image.
#
# Build context is the `apps/` directory (the NestJS project root):
#
#   /apps$ docker build -t spotlight-api .
#
# Two-stage build: the `build` stage compiles TypeScript (dev deps present),
# and a slim `oven/bun` runtime stage installs ONLY production deps and ships
# the compiled output running as an unprivileged user.
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Stage 1 — install all deps + compile
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.0 AS build

WORKDIR /app

# Native-module safety net (bcrypt, better-sqlite3): the lockfile respects
# `bunfig.toml` (ignoreScripts), so prebuilt `.node` binaries ship on disk.
# pkg-config/python3 are present in oven/bun for the rare native compile.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Install dependencies from the committed lockfile for reproducibility.
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# Copy source and compile TypeScript to ./dist.
COPY . .

# Write compiled output to ./dist (see tsconfig/build config).
RUN bun run build

# ---------------------------------------------------------------------------
# Stage 2 — production runtime (deps only, compiled app)
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.0 AS production

ENV NODE_ENV=production

WORKDIR /app

# Run as unprivileged user.
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Install ONLY production dependencies into this stage.
COPY --from=build /app/package.json /app/bun.lock /app/bunfig.toml ./
RUN bun install --frozen-lockfile --production

# Copy compiled output.
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist

USER nodejs

EXPOSE 3000

# `start:prod` = `node dist/main` (see apps/package.json).
CMD ["node", "dist/src/main.js"]
