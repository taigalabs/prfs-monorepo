FROM rust:1.72

EXPOSE 3010

WORKDIR /usr/prfs-monorepo

COPY . .

# install Rust toolchain
RUN rustup toolchain install nightly-2023-10-02-x86_64-unknown-linux-gnu
RUN rustup component add rust-src --toolchain nightly-2023-10-02-x86_64-unknown-linux-gnu

# install nodejs 18
RUN apt-get -qq update
RUN apt-get -qq upgrade --yes
RUN apt-get -qq install curl --yes
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get -qq install nodejs --yes

# install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# # install circom-secq
# RUN git clone https://github.com/taigalabs/circom-secq.git \
#   && cd circom-secq \
#   && cargo install --path circom \
#   && mv /usr/local/cargo/bin/circom /usr/local/cargo/bin/circom-secq

# install pnpm
RUN npm install -g pnpm

RUN pnpm install

RUN ./ci build_prfs_driver_spartan_js

CMD ["./ci", "start_sdk_web_module"]
