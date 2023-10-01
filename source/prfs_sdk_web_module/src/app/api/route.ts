import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: 'Ok',
  });
}

export async function OPTIONS() {
  const res = new NextResponse();
  res.headers.append("Content-Type", "application/json");
  res.headers.append("Allow", "GET,POST,OPTIONS");
  res.headers.append("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.headers.append(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  return res;
}
