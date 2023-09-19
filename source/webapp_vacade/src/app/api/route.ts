// // an endpoint for getting projects data
// export async function GET(req: any, res: any) {
//   "use server";
//   console.log(1111);

//   res.json({ data: 1 });

// }
import { NextResponse } from "next/server";

export async function POST() {
  console.log(123123);
  // const data = await res.json();

  return NextResponse.json({ data: 1 });
}
