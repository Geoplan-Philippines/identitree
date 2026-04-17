# ---- BUILD STAGE ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install deps
RUN npm install

# Generate Prisma client
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build ONLY api
RUN npm run build --workspace=api

# ---- PRODUCTION STAGE ----
FROM node:22-alpine

WORKDIR /app


## Copy the entire API app directory (includes dist, prisma, configs, etc.)
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies (ensures resend and all required packages are present)
RUN npm install

# Expose port
EXPOSE 8000

# Start app
CMD ["node", "apps/api/dist/src/main.js"]
