# Identity Service Dockerfile for AlumniConnect
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema first for generation
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose Identity Service port
EXPOSE 4001

# Start the server
CMD ["npm", "start"]
