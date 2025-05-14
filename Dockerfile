FROM node:18-alpine

RUN npm install -g pm2

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4500