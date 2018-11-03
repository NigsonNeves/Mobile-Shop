#!/bin/sh

cd /home/theo/pli-api/

docker-compose stop
docker-compose rm -f 
docker rm $(docker ps -aq)
docker-compose up --build
