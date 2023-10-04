FROM rust:1.72

EXPOSE 4000

WORKDIR /usr/prfs-monorepo

COPY . .

# install nodejs 18
RUN apt-get -qq update
RUN apt-get -qq upgrade --yes
RUN apt-get -qq install curl --yes
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get -qq install nodejs --yes

# libssl
RUN apt install libssl-dev

# # install wasm-pack
# RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# # install circom-secq
# RUN git clone https://github.com/taigalabs/circom-secq.git \
#   && cd circom-secq \
#   && cargo install --path circom \
#   && mv /usr/local/cargo/bin/circom /usr/local/cargo/bin/circom-secq

# RUN ./ci build_circuits

CMD ["./ci", "dev_api_server"]
