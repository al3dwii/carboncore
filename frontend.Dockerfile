#######################################################################
# frontend.Dockerfile  –  fast, cache-friendly Next.js 14 build
#######################################################################

######################## 1️⃣ deps stage ################################
FROM node:20-alpine AS deps
WORKDIR /app

# copy only lockfiles so cache survives source edits
COPY web/pnpm-lock.yaml* web/package.json ./

# install deps with BuildKit cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.cache/pnpm \
    corepack enable && \
    pnpm install --frozen-lockfile --prefer-offline

######################## 2️⃣ builder stage #############################
FROM node:20-alpine AS builder
WORKDIR /app

# expose pnpm again in this fresh stage
RUN corepack enable

# bring over resolved node_modules
COPY --from=deps /app/node_modules ./node_modules

# now add the application source
COPY web/ .

# production build (creates .next/standalone)
RUN pnpm build

######################## 3️⃣ runtime stage #############################
FROM node:20-alpine AS runtime
RUN adduser -D -u 10001 app
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .

USER app
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
