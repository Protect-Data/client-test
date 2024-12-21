import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const policyId = searchParams.get("id");
    const query: any = await httpClient.get(`/terms/publish/${policyId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
