FROM node:18-alpine

# Install Redis
RUN apk add --no-cache redis

# Set working directory
WORKDIR /app/server

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the entire server directory
COPY . .  
COPY src/services/templates ./dist/services/templates

# Compile TypeScript
RUN npm run build

# Expose necessary ports
EXPOSE 3000 3002 9092 2181 6379

# Start Redis in the background and then run your Node.js app
CMD redis-server --daemonize yes && node dist/index.js
