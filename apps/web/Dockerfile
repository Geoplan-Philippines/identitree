FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable
RUN corepack prepare npm@11.8.0 --activate

RUN npm install -g turbo

FROM base AS pruner
COPY . .
RUN turbo prune web --docker

FROM node:24-alpine AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

FROM installer AS builder
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY --from=pruner /app/out/full/ .
RUN npm run build -- --filter=web

FROM node:24-alpine AS runner
WORKDIR /app/apps/web
ENV NODE_ENV=staging
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/apps/web/.next/standalone/apps/web/ ./
COPY --from=builder /app/apps/web/.next/standalone/node_modules ../../node_modules
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000

CMD ["node", "server.js"]