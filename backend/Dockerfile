FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
RUN npm install

COPY backend ./backend
WORKDIR /app/backend
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm install --omit=dev

COPY --from=builder /app/backend/dist ./backend/dist
WORKDIR /app/backend
EXPOSE 4000
CMD ["npm", "start"]
