FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo

FROM base AS pruner
COPY . .
RUN turbo prune --scope=@identitree/api --docker

FROM node:24-alpine AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build -- --filter=@identitree/api

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=staging

RUN apk add --no-cache libc6-compat

COPY --from=builder /app ./

EXPOSE 8000

CMD ["node", "apps/api/dist/main.js"]