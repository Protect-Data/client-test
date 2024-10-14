import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const query: any = await httpClient.post(`/auth/forgot-password`, data);
    return NextResponse.json({ ...query, success: true });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
