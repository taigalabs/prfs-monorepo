import { NextResponse } from "next/server";

import { envs } from "@/envs";

export async function GET() {
  const json = {
    launch_timestamp: envs.NEXT_PUBLIC_LAUNCH_TIMESTAMP,
    git_commit_hash: envs.NEXT_PUBLIC_GIT_COMMIT_HASH,
  };

  return NextResponse.json(json);
}
