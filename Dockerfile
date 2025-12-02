FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# First copy the tests/.htpasswd file specifically
COPY tests/.htpasswd tests/.htpasswd

# Then copy the rest
COPY ./src ./src
COPY package.json ./

# Verify the file was copied
RUN ls -la tests/ && cat tests/.htpasswd

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fragments -u 1001 -G nodejs

# Change ownership
RUN chown -R fragments:nodejs /app
USER fragments

EXPOSE 8080

CMD ["node", "src/index.js"]
