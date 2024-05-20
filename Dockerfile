# Use an updated official Node.js runtime as a parent image
FROM node:20-alpine

# Define build arguments for environment variables
ARG VITE_API_URL=
ARG VITE_AUTH_USERNAME
ARG VITE_AUTH_PASSWORD
ARG NODE_ENV

# Set environment variables during the build process
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_AUTH_USERNAME=${VITE_AUTH_USERNAME}
ENV VITE_AUTH_PASSWORD=${VITE_AUTH_PASSWORD}
ENV NODE_ENV=${NODE_ENV}

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