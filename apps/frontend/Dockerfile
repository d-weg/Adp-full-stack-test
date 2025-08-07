# Stage 1: Base image with Node.js
FROM node:22-slim AS base
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps
# Copy package files for dependency installation
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY turbo.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/turbo.json ./

# Copy source code
COPY apps/frontend ./apps/frontend
COPY apps/backend/package*.json ./apps/backend/

# Build the frontend with standalone output
RUN npm run build:frontend

# Stage 4: Production runtime
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone output from builder
COPY --from=builder --chown=nonroot:nonroot /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=nonroot:nonroot /app/apps/frontend/public ./apps/frontend/public

USER nonroot

EXPOSE 3000

CMD ["apps/frontend/server.js"]