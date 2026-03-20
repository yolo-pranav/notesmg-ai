FROM node:20-alpine

# Install OpenSSL which is required by Prisma on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
# We need to install all dependencies (including devDependencies like Prisma CLI) to generate the client
RUN npm install

COPY . .

# Generate the Prisma Client so it downloads the correct query engine for Alpine Linux
RUN npx prisma generate

EXPOSE 8080

# Execute DB push to create initialized schema, then boot express HTTP server
CMD ["sh", "-c", "npx prisma db push && node server.js"]
