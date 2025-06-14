FROM node:20-alpine
LABEL immutable="true"
WORKDIR /app
COPY web/package.json ./
RUN corepack enable && pnpm install
COPY . .
CMD ["pnpm","run","dev"]
