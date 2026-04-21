FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo

FROM base AS pruner
COPY . .
RUN turbo prune --scope=@identitree/web --docker

FROM node:24-alpine AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN npm run build -- --filter=@identitree/web

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=staging
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]