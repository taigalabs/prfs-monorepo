import dayjs from "dayjs";
import { NextResponse, NextRequest } from "next/server";

import en from "@/i18n/en";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    en,
  });
}
