#/bin/bash

compose_config_path=$PROJECT_ROOT/internals/docker/compose/docker-compose.yml

printf "Docker copmose file at %s" $compose_config_path;

export CI_CMD="start_prfs_api_server_green"

docker compose \
  -f $compose_config_path \
  up \
  --detach \
  --build \
  prfs_api_server
