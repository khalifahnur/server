FROM node:18-alpine

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

# Compile TypeScript
RUN npm run build

# Expose necessary ports
EXPOSE 3000 3002 9092 2181

# Run compiled JS
CMD ["node", "dist/index.js"]
