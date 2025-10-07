FROM node:20.19.1-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.19.1-alpine
COPY --from=builder /app/dist /app
COPY package.json /app/package.json
RUN cd /app && npm install --production

# Install network utilities
RUN apk add --no-cache iputils arp-scan

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S agent -u 1001

# Change ownership of the app directory
RUN chown -R agent:nodejs /app
USER agent

CMD ["node", "/app/index.js"]
