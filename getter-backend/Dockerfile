# ---------- Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ---------- Runtime stage ----------
FROM node:18-alpine

WORKDIR /app

# Copy only what is needed to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose port (Render injects PORT)
EXPOSE 5000

# Start app
CMD ["node", "dist/index.js"]
