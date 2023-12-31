FROM rust:1.74

EXPOSE 3012

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

# install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install
RUN ./ci build_prfs_crypto_js

CMD ["./ci", "start_prfs_embed_webapp"]
