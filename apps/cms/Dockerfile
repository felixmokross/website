# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22-alpine AS base

# Install latest corepack to work around this issue: https://github.com/nodejs/corepack/issues/612
RUN npm install -g corepack@latest

# Install dependencies only when needed
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV CI=true

RUN corepack enable pnpm

# Install dependencies
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY --link apps/cms apps/cms
COPY --link libs/shared libs/shared
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm --filter cms install --store-dir=/root/.local/share/pnpm/store --frozen-lockfile
RUN ls -la /root/.local/share/pnpm/store

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN --mount=type=cache,target=apps/cms/.next/cache pnpm --dir apps/cms build

# Production image, copy all the files and run next
FROM base AS runner
RUN corepack enable pnpm
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3001
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Copy source files so that we can run scripts like 'payload migrate'
COPY --from=builder /app .

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && mv apps/cms/.next/static apps/cms/.next/standalone/apps/cms/.next/static \
    && cp apps/cms/public apps/cms/.next/standalone/apps/cms/public -r \
    # Set the correct permission for prerender cache
    && chown nextjs:nodejs apps/cms/.next/standalone/apps/cms/.next

USER nextjs

EXPOSE 3001

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node apps/cms/.next/standalone/apps/cms/server.js
