import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const diagId = searchParams.get("diagId");
    const data = await req.json();
    const query: any = await httpClient.post(
      `/diagnostics/generate-task/${diagId}`,
      {
        ...data
      }
    );
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
