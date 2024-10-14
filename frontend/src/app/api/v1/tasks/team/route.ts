import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function GET(req: NextRequest) {
  try {
    const query: any = await httpClient.get("/tasks/team");
    return NextResponse.json([...query]);
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
