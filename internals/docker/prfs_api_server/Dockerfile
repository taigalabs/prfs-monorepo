ARG rust_version

FROM rust:${rust_version}

ARG ci_cmd
ENV CI_CMD=$ci_cmd

ARG git_commit_hash
ENV GIT_COMMIT_HASH=${git_commit_hash}

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

CMD ["sh", "-c", "./ci ${CI_CMD}"]
