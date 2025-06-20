#######################################################################
# frontend.Dockerfile  –  fast, cache-friendly Next.js 14 build
#######################################################################

######################## 1️⃣ deps stage ################################
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend ./frontend
COPY pnpm-lock.yaml package.json ./
RUN corepack enable && pnpm install --frozen-lockfile
WORKDIR /app/frontend
RUN pnpm build

FROM nginx:1.25-alpine AS runtime
COPY --from=builder /app/frontend/.next /usr/share/nginx/html
COPY --from=builder /app/frontend/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
