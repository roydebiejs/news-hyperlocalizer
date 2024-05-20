# Use an updated official Node.js runtime as a parent image and specify the platform
FROM --platform=linux/arm64 node:20-alpine

# Install build tools and dependencies
RUN apk add --no-cache python3 make g++ 

# Set the working directory in the container
WORKDIR /app

# Copy package.json
COPY package.json .

# Install project dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose port 5173 for Vite's development server
EXPOSE 5173

# Command to run Vite development server
CMD ["npm", "run", "dev"]