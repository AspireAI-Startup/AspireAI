# Use an official Node.js image
FROM node:20

# Set the working directory to the root of the project
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variables from .env file (during runtime)
ENV NODE_ENV=production

# Expose a port (only needed if you're running a server)
EXPOSE 3000

# Default command to run index.js (change when needed)
CMD ["node", "index.js"]
