import { parseArgs } from "node:util";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import {
  Endpoint,
  getGitCommitHash,
  getPrfsDevEndpoints,
  getPrfsProdEndpoints,
  getTimestamp,
  writeEnvsToDotEnv,
} from "@taigalabs/prfs-env-js";

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
  const { production } = values;
  let ep: Endpoint;
  if (production) {
    ep = getPrfsProdEndpoints();
  } else {
    ep = getPrfsDevEndpoints();
  }

  const envs: Envs = {
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: ep.prfs_api_server,
    NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT: ep.prfs_id_session_server_socket,
  };

  console.log("Writing envs to %s, envs: %o", DOT_ENV_PATH, envs);
  writeEnvsToDotEnv(envs as any, DOT_ENV_PATH);
}

run();
