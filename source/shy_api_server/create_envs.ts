import { parseArgs } from "node:util";
import path from "path";
import chalk from "chalk";
import {
  getGitCommitHash,
  getPrfsDevEndpoints,
  getPrfsProdEndpoints,
  getTimestamp,
  writeEnvsToDotEnv,
} from "@taigalabs/prfs-env";

// import { Envs } from "./src/envs";

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

async function createEnvs(values: CliArgs) {
  console.log("cli args: %j", values);
  const { production } = values;
  let ep;
  if (production) {
    ep = getPrfsProdEndpoints();
  } else {
    ep = getPrfsDevEndpoints();
  }

  const envs = {
    PRFS_API_SERVER_ENDPOINT: ep.prfs_api_server,
  };

  console.log("Writing envs to %s, envs: %o", DOT_ENV_PATH, envs);
  writeEnvsToDotEnv(envs as any, DOT_ENV_PATH);
}

run().then();

interface CliArgs {
  production: boolean | undefined;
}
