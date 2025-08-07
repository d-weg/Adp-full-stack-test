# Stage 1: Base image with Node.js
FROM node:22-slim AS base
WORKDIR /app

# Stage 2: Install all dependencies (including dev dependencies for build)
FROM base AS deps
# Copy package files for dependency installation
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY turbo.json ./

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm ci

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/turbo.json ./

# Copy source code
COPY apps/backend ./apps/backend
COPY apps/frontend/package*.json ./apps/frontend/

# Build the backend (TypeScript compilation)
RUN npm run build:backend

# Stage 4: Production runtime
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Copy built application and production dependencies
COPY --from=builder --chown=nonroot:nonroot /app/apps/backend/dist ./dist
COPY --from=builder --chown=nonroot:nonroot /app/apps/backend/package*.json ./
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules

USER nonroot

EXPOSE 8000

CMD ["dist/index.js"]