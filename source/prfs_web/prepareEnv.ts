import { parseArgs } from "node:util";
import fs from "fs";
import path from "path";

import { Envs } from "./src/env";

const DOT_ENV_PATH = path.resolve(".env");

function run() {
  console.log("Preparing prfs web launch");

  prepareEnv();
}

function prepareEnv() {
  const { values } = parseArgs({
    options: {
      production: {
        type: "boolean",
      },
      teaser: {
        type: "boolean",
      },
    },
  });
  const { production, teaser } = values;

  const envs = {
    NEXT_PUBLIC_IS_TEASER: teaser ? "yes" : "no",
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: production
      ? "https://api.prfs.xyz"
      : "http://localhost:4000",
    NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: production
      ? "https://asset.prfs.xyz"
      : "http://localhost:4010",
  };
  console.log("Writing envs to %s", DOT_ENV_PATH);

  writeEnvsToDotEnv(envs);
}

function writeEnvsToDotEnv(envs: Envs) {
  let ws = fs.createWriteStream(DOT_ENV_PATH);

  for (const [key, val] of Object.entries(envs)) {
    ws.write(`${key}=${val}\n`);
  }

  ws.close();
}

run();
