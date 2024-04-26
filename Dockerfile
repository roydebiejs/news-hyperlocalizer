# Use an updated official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose port 3000 for Vite's development server
EXPOSE 5173

# Command to run Vite development server
CMD ["npm", "run", "dev"]