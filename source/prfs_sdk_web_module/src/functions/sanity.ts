import { envs } from "@/envs";

export function checkSanity() {
  if (typeof process === undefined) {
    throw new Error("Process is undefined. Is this Next.js?");
  }

  if (envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT === undefined) {
    throw new Error("prfs asset server endpoint is undefined");
  }
}
