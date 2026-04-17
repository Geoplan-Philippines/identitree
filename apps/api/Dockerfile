# -------------------------
# 1. Base image
# -------------------------
FROM node:22-alpine AS base

WORKDIR /app

# -------------------------
# 2. Install dependencies
# -------------------------
FROM base AS deps

COPY package*.json ./
COPY apps/api/package*.json apps/api/
COPY apps/web/package*.json apps/web/

RUN npm install --include=dev --workspaces --include-workspace-root

# -------------------------
# 3. Build stage
# -------------------------
FROM base AS builder

# Copy source code and lock files
COPY . .

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Prisma generate (IMPORTANT)
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build API with workspace-local Nest CLI binary
RUN cd apps/api && npm run build
# Debug: List contents of src and dist
RUN ls -l /app/apps/api/src || echo "src missing"
RUN ls -l /app/apps/api/dist || echo "dist missing"

# Debug: List contents of dist directory after build
RUN ls -l /app/apps/api/dist || echo "dist directory not found"

# -------------------------
# 4. Production image
# -------------------------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production


# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/package*.json ./
# Prisma schema (needed at runtime for migrations)
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 8000

CMD ["node", "apps/api/dist/main.js"]
