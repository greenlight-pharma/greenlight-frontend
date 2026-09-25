FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.js ./
COPY src ./src
COPY shared ./shared
COPY public ./public
RUN npm run build:2doctor

FROM node:22-alpine
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY --from=build --chown=node:node /app/dist-2doctor ./dist-2doctor
COPY --chown=node:node server ./server
COPY --chown=node:node shared ./shared
USER node
EXPOSE 8080
CMD ["node", "server/railway.mjs"]
