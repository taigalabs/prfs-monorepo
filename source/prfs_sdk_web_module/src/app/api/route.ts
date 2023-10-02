import { NextRequest, NextResponse } from "next/server";

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin");

  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { status: "Ok" },
    {
      status: 200,
      headers: getCorsHeaders(req),
    }
  );
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}
