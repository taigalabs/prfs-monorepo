FROM rust:1.76

EXPOSE 4010

WORKDIR /usr/prfs-monorepo

COPY . .

# install nodejs 18
RUN apt-get -qq update
RUN apt-get -qq upgrade --yes
RUN apt-get -qq install curl --yes
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get -qq install nodejs --yes

# install pnpm
RUN npm install -g pnpm
RUN pnpm install

# install circom-secq
RUN git clone https://github.com/taigalabs/circom-secq.git \
  && cd circom-secq \
  && cargo install --path circom \
  && mv /usr/local/cargo/bin/circom /usr/local/cargo/bin/circom-secq

RUN ./ci build_circuits

# libssl
RUN apt install libssl-dev

CMD ["./ci", "start_prfs_asset_server"]
