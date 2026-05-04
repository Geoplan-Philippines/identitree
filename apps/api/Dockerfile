FROM node:24-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable
RUN corepack prepare npm@11.8.0 --activate
RUN npm install -g turbo

FROM base AS pruner
COPY . .
RUN turbo prune api --docker

FROM node:24-alpine AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build -w apps/api

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=staging

RUN apk add --no-cache libc6-compat

COPY --from=builder /app ./

EXPOSE 8000

# Run migrations before starting the app
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && cd /app && node apps/api/dist/src/main.js"]
