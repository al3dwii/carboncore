# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY carboncore-ui .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm build   # generates .next & static

# ---------- runtime ----------
FROM node:20-alpine
RUN adduser -D -u 10001 app
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
USER app
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
