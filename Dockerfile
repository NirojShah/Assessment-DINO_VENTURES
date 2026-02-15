# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything
COPY . .

# Build TS → JS
RUN npm run build

# Expose API port
EXPOSE 3000

# Run the server
CMD ["npm", "start"]
