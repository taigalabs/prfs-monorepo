import fs from "fs";

import { PrfsEnv } from "../bindings/PrfsEnv";
import devEnvJson from "../data/dev.env.json";
import prodEnvJson from "../data/prod.env.json";

export function getPrfsDevEndpoints() {
  const env: PrfsEnv = devEnvJson;
  return env;
}

export function getPrfsProdEndpoints() {
  const env: PrfsEnv = prodEnvJson;
  return env;
}

export function writeEnvsToDotEnv(envs: Record<string, string>, dotEnvPath: string) {
  let ws = fs.createWriteStream(dotEnvPath);

  for (const [key, val] of Object.entries(envs)) {
    ws.write(`${key}=${val}\n`);
  }

  ws.close();
}
