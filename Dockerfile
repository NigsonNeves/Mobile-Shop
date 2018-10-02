FROM node:stretch

WORKDIR /code

COPY package.json .


RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install
