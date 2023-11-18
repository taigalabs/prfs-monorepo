import { NextResponse } from "next/server";

// an endpoint for getting projects data
export async function POST(req: Request) {
  console.log(5555, req.url);

  const { searchParams } = new URL(req.url);
  const cs = searchParams.get("cursor");
  const cursor = parseInt(cs!) || 0;
  const pageSize = 5;

  const data = Array(pageSize)
    .fill(0)
    .map((_, i) => {
      return {
        name: "Project " + (i + cursor) + ` (server time: ${Date.now()})`,
        id: i + cursor,
      };
    });

  const nextId = cursor < 10 ? data[data.length - 1].id + 1 : null;
  const previousId = cursor > -10 ? data[0].id - pageSize : null;

  return NextResponse.json({ data, nextId, previousId });
}
