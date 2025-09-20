# Dev stage (Using tsx for hot reload)
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8000
CMD [ "npm", "start" ]