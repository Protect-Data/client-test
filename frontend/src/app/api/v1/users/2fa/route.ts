import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const query: any = await httpClient.delete(`/auth/two-factor/${userId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
