#/bin/bash

compose_config_path=$PROJECT_ROOT/internals/docker/compose/docker-compose.yml

printf "Docker copmose file at %s" $compose_config_path;

docker compose \
  -f $compose_config_path \
  up \
  --detach
