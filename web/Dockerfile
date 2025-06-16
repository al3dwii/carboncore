FROM node:20-alpine
WORKDIR /app

# copy config & lockfiles first
COPY .npmrc postcss.config.js tailwind.config.js package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

# polling avoids macOS file-watch limits if you ever re-add a bind mount
ENV CHOKIDAR_USEPOLLING=true

CMD ["pnpm", "dev", "-p", "3000"]
