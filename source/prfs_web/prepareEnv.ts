import { parseArgs } from "node:util";
import fs from "fs";
import path from "path";
import util from "util";

import { Envs } from "./src/env";

const DOT_ENV_PATH = path.resolve(".env");

const envs_prod: Envs = {
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: "http://localhost:4000",
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: "https://api.prfs.xyz",
};

const envs_dev: Envs = {
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: "http://localhost:4010",
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: "https://asset.prfs.xyz",
};

function run() {
  console.log("Preparing prfs web launch");

  prepareEnv();
}

function prepareEnv() {
  const { values } = parseArgs({
    options: {
      env: {
        type: "string",
      },
    },
  });
  const { env } = values;

  const envs = env === "development" ? envs_dev : envs_prod;
  console.log("Writing envs to %s", DOT_ENV_PATH);

  writeEnvsToDotEnv(envs);
}

function isDev(env: string) {
  return env === "development";
}

function writeEnvsToDotEnv(envs: Envs) {
  let ws = fs.createWriteStream(DOT_ENV_PATH);

  for (const [key, val] of Object.entries(envs)) {
    ws.write(`${key}=${val}\n`);
  }

  ws.close();
}

run();
