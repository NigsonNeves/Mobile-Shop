FROM node:stretch

WORKDIR /code
COPY package-lock.json .
COPY package.json .

RUN npm install
