FROM node:20-alpine

WORKDIR /app

# copy only the lock-files first for cache-friendly install
COPY package.json pnpm-lock.yaml* ./

RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "dev", "-p", "3000"]
