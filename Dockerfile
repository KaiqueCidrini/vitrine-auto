# syntax=docker/dockerfile:1

# ---------- Base ----------
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

# ---------- Dependências (inclui as de desenvolvimento, usadas no build e nos scripts) ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Ferramentas: migrations, criação do gerente, seed e limpeza de fotos ----------
FROM deps AS tools
COPY . .
RUN mkdir -p /app/storage && chown -R node:node /app/storage
USER node
CMD ["npm", "run", "db:migrate"]

# ---------- Build da aplicação ----------
FROM deps AS builder
COPY . .
# A concessionária e o domínio das fotos entram no build (páginas estáticas e config de imagens).
ARG TENANT=demo
ARG S3_PUBLIC_URL=
ENV TENANT=${TENANT} S3_PUBLIC_URL=${S3_PUBLIC_URL}
RUN npm run build

# ---------- Imagem final, enxuta ----------
FROM base AS runner
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
RUN mkdir -p /app/storage && chown node:node /app/storage
USER node
EXPOSE 3000
CMD ["node", "server.js"]
