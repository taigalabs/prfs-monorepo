import { parseArgs } from "node:util";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import child_process from "child_process";

import { Envs } from "./src/envs";

const DOT_ENV_PATH = path.resolve(".env");

async function run() {
  console.log("%s createEnvs.ts prfs web launch", chalk.green("Launching"));

  const ts = await getGitTimestamp();
  createEnvs(ts);
}

function createEnvs(ts: string) {
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

  console.log("cli args: %j", values);

  const { production, teaser } = values;

  const env_dev: Envs = {
    NEXT_PUBLIC_IS_TEASER: teaser ? "yes" : "no",
    NEXT_PUBLIC_UPDATE_TIMESTAMP: ts,
    NEXT_PUBLIC_CODE_REPOSITORY_URL: "https://github.com/taigalabs/prfs-monorepo",
    NEXT_PUBLIC_TAIGALABS_ENDPOINT: "http://localhost:3060",
    NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT: "http://localhost:3020",
    NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: "http://localhost:3000",
    NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT: "http://localhost:3021",
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: "http://localhost:4000",
    NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: "http://localhost:4010",
    NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: "http://localhost:3010",
    NEXT_PUBLIC_ZAUTH_VERSION: "0.1.0",
    NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT: "http://localhost:3061",
  };

  const env_prod: Envs = {
    NEXT_PUBLIC_IS_TEASER: teaser ? "yes" : "no",
    NEXT_PUBLIC_UPDATE_TIMESTAMP: ts,
    NEXT_PUBLIC_CODE_REPOSITORY_URL: "https://github.com/taigalabs/prfs-monorepo",
    NEXT_PUBLIC_TAIGALABS_ENDPOINT: "https://www.taigalabs.xyz",
    NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT: "https://console.prfs.xyz",
    NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: "https://www.prfs.xyz",
    NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT: "https://poll.prfs.xyz",
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: "https://api.prfs.xyz",
    NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: "https://asset.prfs.xyz",
    NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: "https://sdk.prfs.xyz",
    NEXT_PUBLIC_ZAUTH_VERSION: "0.1.0",
    NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT: "http://docs.prfs.xyz",
  };

  const envs = production ? env_prod : env_dev;
  console.log("Writing envs to %s, envs: %o", DOT_ENV_PATH, envs);

  writeEnvsToDotEnv(envs);
}

function writeEnvsToDotEnv(envs: Envs) {
  let ws = fs.createWriteStream(DOT_ENV_PATH);

  for (const [key, val] of Object.entries(envs)) {
    ws.write(`${key}=${val}\n`);
  }

  ws.close();
}

async function getGitTimestamp() {
  const output = child_process.execSync(
    `TZ=UTC0 git show --quiet --date=iso-strict --format="%cd"`
  );

  return output.toString();
}

run().then();
