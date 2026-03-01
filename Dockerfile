# Stage 1: The Build Environment
# We use a Node.js image to compile the Next.js application
FROM node:22-alpine AS build

# Enable pnpm via Corepack (bundled with Node.js)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (for faster dependency caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production (standalone output)
RUN pnpm run build

# --- Stage 2: The Production Runtime Environment ---
# We use a small Node Alpine image to run the standalone Next.js server
FROM node:22-alpine AS final

WORKDIR /app

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build output and static assets from the build stage
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Next.js standalone server listens on port 3000 by default
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# The default command runs the standalone server
CMD ["node", "server.js"]
