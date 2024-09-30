import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const checklistId = searchParams.get("checklistId");
    const query: any = await httpClient.put(
      `/checklist/finalize/${checklistId}`
    );
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
