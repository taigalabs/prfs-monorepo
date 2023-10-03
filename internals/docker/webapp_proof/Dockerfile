FROM rust:1.72

WORKDIR /usr/prfs-monorepo

COPY . .

RUN apt-get -qq update \
  && apt-get -qq upgrade --yes \
  && apt-get -qq install curl --yes \
  && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get -qq install nodejs --yes 

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh \
  && git clone https://github.com/taigalabs/circom-secq.git \
  && echo $HOME \
  && cd circom-secq \
  && cargo install --path circom \
  && which circom \
  && mv /usr/local/cargo/bin/circom /usr/local/cargo/bin/circom-secq \
  && which circom-secq

# RUN ./ci build

