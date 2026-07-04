FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
RUN npm install

COPY frontend ./frontend
WORKDIR /app/frontend
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18-alpine
WORKDIR /app/frontend
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/frontend/public ./public
# standalone output enables running without node_modules
COPY --from=builder /app/frontend/.next/standalone/ ./
COPY --from=builder /app/frontend/.next/standalone/frontend/ ./
COPY --from=builder /app/frontend/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
