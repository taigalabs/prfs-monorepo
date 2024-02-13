import { parseArgs } from "node:util";
import path from "path";
import chalk from "chalk";
import {
  getGitCommitHash,
  getPrfsDevEndpoints,
  getPrfsProdEndpoints,
  getTimestamp,
  writeEnvsToDotEnv,
} from "@taigalabs/prfs-env-js";

import { Envs } from "./src/envs";

const DOT_ENV_PATH = path.resolve(".env");

async function run() {
  console.log("%s createEnvs.ts prfs web launch", chalk.green("Launching"));
  const { values } = parseArgs({
    options: {
      production: {
        type: "boolean",
      },
    },
  });

  console.log("[create-envs] cli args: %j", values);
  createEnvs(values);
}

function createEnvs(values: CliArgs) {
  console.log("cli args: %j", values);
  const { production } = values;
  let ep;
  if (production) {
    ep = getPrfsProdEndpoints();
  } else {
    ep = getPrfsDevEndpoints();
  }

  const gitCommitHash = getGitCommitHash();
  const timestamp = getTimestamp();
  const envs: Envs = {
    NEXT_PUBLIC_LAUNCH_TIMESTAMP: timestamp,
    NEXT_PUBLIC_GIT_COMMIT_HASH: gitCommitHash,
    NEXT_PUBLIC_CODE_REPOSITORY_URL: ep.prfs_code_repository,
    NEXT_PUBLIC_TAIGALABS_ENDPOINT: ep.taigalabs_website,
    NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT: ep.prfs_console_webapp,
    NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: ep.prfs_proof_webapp,
    NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT: ep.prfs_id_webapp,
    NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT: ep.prfs_poll_webapp,
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: ep.prfs_api_server,
    NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: ep.prfs_asset_server,
    NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT: ep.prfs_id_session_server_socket,
    NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT: ep.prfs_docs_website,
  };

  console.log("Writing envs to %s, envs: %o", DOT_ENV_PATH, envs);
  writeEnvsToDotEnv(envs as any, DOT_ENV_PATH);
}

run().then();

interface CliArgs {
  production: boolean | undefined;
}
