export interface Envs {
  NEXT_PUBLIC_VERSION: string;
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: string;
}

export const envs: Envs = {
  NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT,
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT,
};

function requireEnv(name: keyof Envs) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`process env is not defined, name: ${name}`);
  }

  return val;
}
