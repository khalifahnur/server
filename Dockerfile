# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY ../package.json ../package-lock.json ./
RUN npm install

# Copy rest of the application files
COPY . .

# Expose necessary ports
EXPOSE 3002 3000 9092 2181

# Start the application
CMD ["npx", "ts-node", "server/index.ts"]
