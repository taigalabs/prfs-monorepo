#/bin/bash

set -e

docker pull postgres 

docker stop localPostgres || true && \

docker rm localPostgres || true && \

docker run\
    --name localPostgres\
    -p 5455:5432\
    -e POSTGRES_USER=postgres\
    -e POSTGRES_PASSWORD=postgres\
    -e POSTGRES_DB=postgres\
    -d\
    postgres
