# Base Node.js image
FROM node:alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Define build arguments (to pass environment variables during build)
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_AUTH_WS

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then \
    echo "Using Yarn for installation" && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    echo "Using npm for installation" && npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Using pnpm for installation" && corepack enable pnpm && pnpm install --frozen-lockfile; \
  else \
    echo "No lockfile found. Ensure yarn.lock, package-lock.json, or pnpm-lock.yaml is present." && exit 1; \
  fi

# Build the project
FROM base AS builder
WORKDIR /app

# Pass build arguments to this stage
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_AUTH_WS

# Make sure the dependencies are copied
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN \
  if [ -f yarn.lock ]; then \
    echo "Building with Yarn" && yarn build; \
  elif [ -f package-lock.json ]; then \
    echo "Building with npm" && npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Building with pnpm" && corepack enable pnpm && pnpm build; \
  else \
    echo "No lockfile found during build step." && exit 1; \
  fi

# Final runtime image
FROM base AS runner
WORKDIR /app

# Environment variables for runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_AUTH_WS=$NEXT_PUBLIC_AUTH_WS

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./app/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Set proper permissions for `.next`
RUN chown -R nextjs:nodejs .next && mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
