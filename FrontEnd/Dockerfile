# 1) Build stage
FROM node:20 AS build
WORKDIR /app

# Copy only files needed to install deps first (better caching)
COPY FrontEnd/package*.json ./
# If you have lockfile, this makes deterministic builds:
RUN npm ci

# Copy the rest of your app
COPY FrontEnd/ ./

# Build Nuxt (outputs to .output/)
RUN npm run build

# 2) Run stage
FROM node:20
WORKDIR /app
ENV NITRO_PORT=3000
# Copy only the built output (and any runtime files you need, e.g. public/)
COPY --from=build /app/.output ./.output
# If you serve static assets from public/ at runtime, copy it:
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
