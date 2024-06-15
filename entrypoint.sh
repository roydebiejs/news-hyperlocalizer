#!/bin/bash

# Source the .env file
set -a
source .env
set +a

# Write environment variables to .env file
echo "VITE_API_URL=${VITE_API_URL}" > .env
echo "VITE_API_USERNAME=${VITE_API_USERNAME}" >> .env
echo "VITE_API_PASSWORD=${VITE_API_PASSWORD}" >> .env

# Output a message indicating the environment variables have been set
echo "Environment variables have been written to .env file."

# Start the application
npm run dev
