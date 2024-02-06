import fs from "fs";

export function getPrfsDevEndpoints() {
  const env: Endpoint = {
    prfs_code_repository: "https://github.com/taigalabs/prfs-monorepo",
    taigalabs_website: "http://localhost:3060",
    prfs_console_webapp: "http://console.localhost:3000",
    prfs_proof_webapp: "http://localhost:3000",
    prfs_embed_webapp: "http://localhost:3010",
    prfs_id_webapp: "http://localhost:3011",
    prfs_poll_webapp: "http://localhost:3021",
    prfs_api_server: "http://localhost:4000",
    prfs_asset_server: "http://localhost:4010",
    prfs_sdk_web: "http://localhost:3012",
    prfs_id_session_server_socket: "ws://localhost:4000",
    prfs_docs_website: "http://localhost:3061",
    shy_webapp: "http://localhost:3022",
    shy_docs_website: "http://localhost:3062",
  };

  return env;
}

export function getPrfsProdEndpoints() {
  const env: Endpoint = {
    taigalabs_website: "https://www.taigalabs.xyz",
    prfs_code_repository: "https://github.com/taigalabs/prfs-monorepo",
    prfs_console_webapp: "https://console.prfs.xyz",
    prfs_proof_webapp: "https://www.prfs.xyz",
    prfs_id_webapp: "http://id.prfs.xyz",
    prfs_embed_webapp: "https://sdk.prfs.xyz",
    prfs_poll_webapp: "https://poll.prfs.xyz",
    prfs_api_server: "https://api.prfs.xyz",
    prfs_id_session_server_socket: "wss://api.prfs.xyz",
    prfs_asset_server: "https://d16rd1gzhabnej.cloudfront.net/assets/circuits",
    prfs_sdk_web: "https://sdk.prfs.xyz",
    prfs_docs_website: "https://docs.prfs.xyz",
    shy_webapp: "https://www.shy.chat",
    shy_docs_website: "https://docs.chat.chat",
  };

  return env;
}

export interface Endpoint {
  taigalabs_website: string;
  prfs_code_repository: string;
  prfs_embed_webapp: string;
  prfs_id_webapp: string;
  prfs_console_webapp: string;
  prfs_proof_webapp: string;
  prfs_poll_webapp: string;
  prfs_sdk_web: string;
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
