# API Gateway Dockerfile for AlumniConnect
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose API Gateway port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
