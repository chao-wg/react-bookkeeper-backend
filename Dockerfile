FROM node:18-bookworm-slim

RUN npm install -g pnpm

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and package-lock.json
COPY package*.json ./

RUN pnpm install

# Copy the source code
COPY dist/ ./dist
COPY prisma/ ./prisma

COPY start.sh ./
RUN chmod +x start.sh

RUN pnpm dlx prisma generate

CMD ["./start.sh"]
