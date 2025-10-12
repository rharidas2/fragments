# Dockerfile for fragments node.js microservice
# This Dockerfile defines how to build a Docker image for our fragments service

# Use node version that matches your local environment
FROM node:18.13.0

# Metadata about the image
LABEL maintainer="Rohit <your.email@example.com>"
LABEL description="Fragments node.js microservice"

# Environment variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy package.json and package-lock.json files into the working dir (/app)
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# We run our service on port 8080
EXPOSE 8080

# Start the container by running our server
CMD npm start
