# News Hyperlocalizer Front-end

This repo is for the front end of the News Hyperlocalizer challenge. The back-end repo can be found at [News Hyperlocalizer Back-end](https://github.com/RUlfman/news_hyperlocalizer).

## Prerequisites

Before you begin, make sure you have the following installed:

- **Docker**: Docker is used to containerize the development environment. You can create a Docker account and download Docker Desktop from the [official Docker website](https://www.docker.com/products/docker-desktop/).
- **GitHub Account**: You will need a GitHub account to access the GitHub Container Registry (GHCR).
- **Personal Access Token (PAT)**: You will need a Personal Access Token (PAT) to access the GitHub Container Registry (GHCR). You can create a PAT by going to your GitHub account settings, selecting Developer settings, Personal access tokens, and then clicking Generate new token. Make sure to copy the token as you will not be able to see it again. The PAT should have the `read:packages` scope.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development purposes.

### Installation

To set up your development environment:

1. Clone the repo:
   ```bash
   git clone https://github.com/roydebiejs/news-hyperlocalizer.git
   cd news-hyperlocalizer
   ```
2. Start the development server:
   ```bash
   docker-compose up --build
   ```

This will build the Docker image if it's not already built and start the container. The Vite development server will be accessible at http://localhost:5173, and it will reflect changes made to your local files in real time.

### Usage

After running the commands above, you can start developing your application. The server will reload if you make edits. You will also see any lint errors in the console.

### Alternative Installation with Docker Packages

If you prefer to use pre-built Docker packages instead of cloning the code, you can do so with the following commands:

1. Pull the Docker image:
   ```bash
   docker pull ghcr.io/roydebiejs/news-hyperlocalizer:latest
   ```
2. Run the Docker container:
   ```bash
   docker run --name news_hyperlocalizer_frontend -d -p 5173:5173 ghcr.io/roydebiejs/news-hyperlocalizer:latest
   ```

This method allows you to run the application without having to clone the repository.

## Additional Notes

- If you experience any problems, please make sure Docker is running on your machine.
- Ensure that no other services are running on port 5173 to avoid port conflicts.
