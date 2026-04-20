FROM node:22-slim AS base
WORKDIR /app

# ---------- PRUNE ----------
FROM base AS pruner
RUN npm install -g turbo

COPY . .
RUN turbo prune web --docker

# ---------- INSTALL ----------
FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

# ✅ FIX: ensures Next.js + SWC dependencies exist
RUN npm ci --legacy-peer-deps

COPY --from=pruner /app/out/full/ .

# ---------- BUILD ----------
FROM base AS builder
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app .

# ⚠️ FIX FOR SWC ERROR
RUN npm install @swc/helpers --no-save

RUN npx turbo run build --filter=web

# ---------- RUNNER ----------
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# ✅ standalone output: self-contained server.js — no `next` CLI needed
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
