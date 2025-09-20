# --- Base Dependencies Layer ---
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.6.0 --activate
COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY . .
RUN yarn install

# --- Development Layer ---
FROM base AS dev
WORKDIR /app
# Install netcat for database connectivity check
RUN apk add --no-cache netcat-openbsd
COPY ../../apps/server ./apps/server
COPY ../../shared ./shared
ENV NODE_ENV=development
EXPOSE 3000
CMD yarn server:dev

# --- Builder Layer ---
FROM base AS builder
WORKDIR /app
COPY . .
RUN yarn workspace server build

# --- Production Layer ---
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./app
COPY --from=builder /app/shared ./shared
ENV NODE_ENV=production
EXPOSE 3000
CMD yarn server:start
