FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
RUN cd frontend && npm run build

COPY backend ./backend
COPY frontend/build ./frontend/build

EXPOSE 5000

WORKDIR /app/backend
CMD ["npm", "start"]
