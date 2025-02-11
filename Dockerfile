# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY api-gateway/package*.json ./

# Copy source code and configuration files
COPY api-gateway/src ./src
COPY api-gateway/index.ts ./
COPY api-gateway/tsconfig.json ./
COPY api-gateway/.env ./.env
COPY api-gateway/.env.example ./.env.example

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.env.example ./.env.example

# Install production dependencies
RUN npm install --only=production

EXPOSE 3002

CMD ["node", "dist/index.js"]