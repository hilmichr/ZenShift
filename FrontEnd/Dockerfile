# ---------- Build stage ----------
FROM node:20 AS build
WORKDIR /app

# deps (cache-friendly)
COPY package*.json ./
RUN npm ci

# source
COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM node:20
WORKDIR /app
ENV NITRO_PORT=3000
COPY --from=build /app/.output ./.output
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
