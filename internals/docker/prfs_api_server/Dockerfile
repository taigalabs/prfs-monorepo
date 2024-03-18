FROM rust:1.76

EXPOSE 4000

WORKDIR /usr/prfs-monorepo

COPY . .

# Install nodejs 18
RUN apt-get -qq update \
  apt-get -qq upgrade --yes \
  apt-get -qq install curl --yes \
  curl -sL https://deb.nodesource.com/setup_18.x | bash - \
  apt-get -qq install nodejs --yes \
  apt install -y chromium \
  apt install libssl-dev

CMD ["./ci", "start_prfs_api_server"]
