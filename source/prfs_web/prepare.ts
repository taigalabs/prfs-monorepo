import { parseArgs } from "node:util";
import fs from "fs";
import path from "path";
import util from "util";

import { Envs } from "./src/env";

const DOT_ENV_PATH = path.resolve(".env");

const API_SERVER_ENDPOINT = {
  dev: "http://localhost:4000",
  prod: "https://api.prfs.xyz",
};

const ASSET_SERVER_ENDPOINT = {
  dev: "http://localhost:4010",
  prod: "https://asset.prfs.xyz",
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

  const envs: Envs = {
    NEXT_PUBLIC_ADDR_MEMBERSHIP_TEMP_CIRCUIT_URL: isDev(env) ? "" : "",
    NEXT_PUBLIC_ADDR_MEMBERSHIP_TEMP_WTNS_GEN_URL: isDev(env) ? "" : "",
  };

  console.log("Writing envs to %s", DOT_ENV_PATH);

  writeEnvsToDotEnv(envs);
  // fs.writeFileSync(DOT_ENV_PATH, "power");
}

function isDev(env: string) {
  return env === "development";
}

function writeEnvsToDotEnv(envs: Envs) {
  // if (env === "development") {
  //   let line = util.format("%s%s=%s");
  //   contents.push(line);
  // } else {
  // }
  //
  for (const [key, val] of Object.entries(envs)) {
  }
}

run();

// NEXT_PUBLIC_MEMBERSHIP_PROVER_WITNESS_GEN_WASM_URL=http://localhost:4010/assets/prfs_wasm/prfs_wasm_1688997893047_bg.wasm

// NEXT_PUBLIC_MEMBERSHIP_PROVER_CIRCUIT_URL=power2

// NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT=http://localhost:4000/api/v0

// NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT=http://localhost:4010/
