FROM rust:1.76

EXPOSE 3000

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

CMD ["./ci", "start_prfs_proof_webapp"]
