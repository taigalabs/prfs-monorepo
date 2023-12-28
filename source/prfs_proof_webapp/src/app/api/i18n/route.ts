import { NextResponse, NextRequest } from "next/server";

import { en } from "@taigalabs/prfs-i18n";

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    en,
  });
}
