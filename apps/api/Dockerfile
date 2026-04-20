FROM node:22-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

# ---------- PRUNE ----------
FROM base AS pruner
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker

# ---------- INSTALL ----------
FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=pruner /app/out/full/ .

# ---------- BUILD ----------
FROM base AS builder
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app .

RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npx turbo run build --filter=api

# ---------- RUNNER ----------
FROM node:22-slim AS runner
WORKDIR /app

# Prisma needs openssl at runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# ✅ Copy Prisma schema + migrations so we can run migrate deploy at startup
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./prisma.config.ts

# Entrypoint: run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/src/main.js"]
