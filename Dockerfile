# # Use official Node.js image
# FROM node:18

# # Set working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY ../package.json ../package-lock.json ./
# RUN npm install

# # Copy rest of the application files
# COPY . .

# # Expose necessary ports
# EXPOSE 3002 3000 9092 2181

# # Start the application
# CMD ["npx", "ts-node", "index.ts"]

FROM node:18

# Set working directory to the server folder
WORKDIR /app/server

# Copy package.json and package-lock.json first
COPY server/package.json server/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire server directory
COPY server . 

# Expose necessary ports
EXPOSE 3000 3002 3000 9092 2181

# Run TypeScript with ts-node
CMD ["npx", "ts-node", "index.ts"]

