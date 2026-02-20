# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiamos solo lo necesario
COPY --from=builder --chown=node:node --chmod=775 /app/.next/standalone ./
COPY --from=builder --chown=node:node --chmod=775 /app/.next/static ./.next/static
COPY --from=builder --chown=node:node --chmod=775 /app/public ./public

COPY --chown=node:node --chmod=775 .env ./

EXPOSE 3000

CMD ["node", "server.js"]
