FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]

###

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
COPY ../../apps/client ./apps/client
COPY ../../shared ./shared
ENV NODE_ENV=development
EXPOSE 3001
CMD yarn client:dev

# --- Builder Layer ---
FROM base AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace client build

# --- Production Layer ---
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/client/dist ./app/dist
COPY --from=builder /app/apps/client/build ./app/build
COPY --from=builder /app/shared ./shared
ENV NODE_ENV=production
EXPOSE 3001
CMD yarn client:start
