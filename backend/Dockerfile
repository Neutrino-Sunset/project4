FROM node:lts-alpine

WORKDIR /backend

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

