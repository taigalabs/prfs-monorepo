ARG RUST_VERSION

FROM rust:${RUST_VERSION}

ARG CI_CMD

ENV GIT_COMMIT_HASH=${GIT_COMMIT_HASH}

EXPOSE 4000

WORKDIR /usr/prfs-monorepo

COPY . .

# Install nodejs 18
RUN apt-get -qq update \
  && apt-get -qq upgrade --yes \
  && apt-get -qq install curl --yes \
  && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get -qq install nodejs --yes \
  && apt install -y chromium \
  && apt install libssl-dev

RUN ./ci $CI_CMD
