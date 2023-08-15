import { parseArgs } from "node:util";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { Envs } from "./src/envs";

const DOT_ENV_PATH = path.resolve(".env");

function run() {
  console.log("%s createEnvs.ts prfs web launch", chalk.green("Launching"));

  createEnvs();
}

function createEnvs() {
  const { values } = parseArgs({
    options: {
      production: {
        type: "boolean",
      },
    },
  });

  console.log("cli args: %j", values);

  const envs = {
    NEXT_PUBLIC_VERSION: "0.1.0",
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: values.production
      ? "https://api.prfs.xyz"
      : "http://localhost:4000",
    NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: values.production
      ? "https://asset.prfs.xyz"
      : "http://localhost:4010/assets",
  };
  console.log("%s envs to %s", chalk.green("Writing"), DOT_ENV_PATH);

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
