export interface Envs {
  NEXT_PUBLIC_IS_TEASER: string;
  NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: string;
}

export const envs: Envs = {
  NEXT_PUBLIC_IS_TEASER: requireEnv('NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT'),
  NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: requireEnv("NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT"),
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: requireEnv("NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT"),
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: requireEnv("NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT"),
  NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: requireEnv("NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT"),
};

function requireEnv(name: keyof Envs) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`process env is not defined, name: ${name}`);
  }

  return val;
}
