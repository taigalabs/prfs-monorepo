import fs from "fs";

import devEnvJson from "../data/dev.env.json";
import prodEnvJson from "../data/prod.env.json";

export function getPrfsDevEndpoints() {
  const env: Endpoint = devEnvJson;
  return env;
}

export function getPrfsProdEndpoints() {
  const env: Endpoint = prodEnvJson;
  return env;
}

export interface Endpoint {
  taigalabs_website: string;
  prfs_code_repository: string;
  prfs_id_webapp: string;
  prfs_console_webapp: string;
  prfs_proof_webapp: string;
  prfs_poll_webapp: string;
  prfs_docs_website: string;
  prfs_api_server: string;
  prfs_asset_server: string;
  prfs_id_session_server_socket: string;
  shy_webapp: string;
  shy_docs_website: string;
}

export function writeEnvsToDotEnv(envs: Record<string, string>, dotEnvPath: string) {
  let ws = fs.createWriteStream(dotEnvPath);

  for (const [key, val] of Object.entries(envs)) {
    ws.write(`${key}=${val}\n`);
  }

  ws.close();
}
