# Base Node.js image
FROM node:alpine AS base

# Define a base working directory
WORKDIR /app

# Install dependencies only once
FROM base AS deps

# Instalar dependências necessárias no sistema
RUN apk add --no-cache libc6-compat

# Copiar apenas os arquivos necessários para o gerenciamento de pacotes
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Instalar dependências com base no gerenciador de pacotes detectado
RUN \
  if [ -f yarn.lock ]; then \
    echo "Using Yarn for dependencies" && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    echo "Using npm for dependencies" && npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Using pnpm for dependencies" && corepack enable pnpm && pnpm install --frozen-lockfile; \
  else \
    echo "No lockfile found. Ensure yarn.lock, package-lock.json, or pnpm-lock.yaml is present." && exit 1; \
  fi

# Build application in the same layer to save resources
FROM deps AS builder

# Copiar o restante dos arquivos do projeto
COPY . .

# Construir a aplicação
RUN \
  if [ -f yarn.lock ]; then \
    echo "Building with Yarn" && yarn build; \
  elif [ -f package-lock.json ]; then \
    echo "Building with npm" && npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Building with pnpm" && corepack enable pnpm && pnpm build; \
  else \
    echo "No lockfile found during build step." && exit 1; \
  fi

# Preparar o ambiente final para execução
FROM base AS runner

# Definir variáveis de ambiente para runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Criar usuário para segurança
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copiar os artefatos da build para a imagem final
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Configurar permissões para o cache do Next.js
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

# Mudar para o usuário seguro
USER nextjs

# Expor a porta para o servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
