# Use an updated official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json
COPY package.json .

# Install project dependencies
RUN npm install

# Create an empty .env file (if needed)
RUN touch .env

# Copy the rest of your app's source code
COPY . .

# Expose port 5173 for Vite's development server
EXPOSE 5173

# Command to run Vite development server
CMD ["sh", "entrypoint.sh"]