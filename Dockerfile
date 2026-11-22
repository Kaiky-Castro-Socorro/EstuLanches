# ---------- base: dependências comuns ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- test: inclui devDependencies (jest, supertest) ----------
FROM base AS test
RUN npm install
COPY . .
CMD ["npm", "test"]

# ---------- prod: imagem final, enxuta e sem root ----------
FROM base AS prod
ENV NODE_ENV=production
RUN npm install --omit=dev && npm cache clean --force
COPY src ./src
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "src/server.js"]
