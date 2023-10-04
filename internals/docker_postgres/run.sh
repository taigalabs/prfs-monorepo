#/bin/bash

set -e

docker pull postgres 

docker stop prfs_postgres || true && \

docker rm prfs_postgres || true && \

docker run\
    --name prfs_postgres\
    -p 5433:5432\
    -e POSTGRES_USER=postgres\
    -e POSTGRES_PASSWORD=postgres\
    -e POSTGRES_DB=postgres\
    -d\
    postgres
