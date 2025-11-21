# Multi-stage Dockerfile for fragments node.js microservice
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Runtime  
FROM node:18-alpine AS runtime

# Metadata about the image
LABEL maintainer="Rohit <rharidas2@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY ./src ./src
COPY package.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fragments -u 1001
USER fragments

# We run our service on port 8080
EXPOSE 8080

# Start the container by running our server
CMD ["npm", "start"]
