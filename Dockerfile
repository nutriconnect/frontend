FROM node:22-alpine

WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Source code is mounted via docker-compose volume, not copied here
CMD ["npm", "run", "dev"]
