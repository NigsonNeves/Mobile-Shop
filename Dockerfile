FROM node:stretch

WORKDIR /code

COPY package.json .

RUN npm install
