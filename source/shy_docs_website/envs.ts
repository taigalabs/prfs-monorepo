export interface Envs {
  NEXT_PUBLIC_LAUNCH_TIMESTAMP: string;
  NEXT_PUBLIC_GIT_COMMIT_HASH: string;
  NEXT_PUBLIC_CODE_REPOSITORY_URL: string;
  NEXT_PUBLIC_TAIGALABS_ENDPOINT: string;
  NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT: string;
  NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: string;
  NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_EMBED_WEBAPP_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT: string;
  NEXT_PUBLIC_SHY_WEBAPP_ENDPOINT: string;
  NEXT_PUBLIC_SHY_DOCS_WEBSITE_ENDPOINT: string;
}

export const envs: Envs = {
  NEXT_PUBLIC_LAUNCH_TIMESTAMP: process.env.NEXT_PUBLIC_LAUNCH_TIMESTAMP,
  NEXT_PUBLIC_GIT_COMMIT_HASH: process.env.NEXT_PUBLIC_GIT_COMMIT_HASH,
  NEXT_PUBLIC_CODE_REPOSITORY_URL: process.env.NEXT_PUBLIC_CODE_REPOSITORY_URL,
  NEXT_PUBLIC_TAIGALABS_ENDPOINT: process.env.NEXT_PUBLIC_TAIGALABS_ENDPOINT,
  NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT: process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT,
  NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT,
  NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT: process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT,
  NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT,
  NEXT_PUBLIC_PRFS_EMBED_WEBAPP_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_EMBED_WEBAPP_ENDPOINT,
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT,
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT,
  NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
  NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT: process.env.NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT,
  NEXT_PUBLIC_SHY_WEBAPP_ENDPOINT: process.env.NEXT_PUBLIC_SHY_WEBAPP_ENDPOINT,
  NEXT_PUBLIC_SHY_DOCS_WEBSITE_ENDPOINT: process.env.NEXT_PUBLIC_SHY_DOCS_WEBSITE_ENDPOINT,
};