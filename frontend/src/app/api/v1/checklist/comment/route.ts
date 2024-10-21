import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const checklistId = searchParams.get("checklistId");
    const data = await req.json();
    const query: any = await httpClient.post(
      `/checklist/comment/${checklistId}`,
      data
    );
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const commentId = searchParams.get("commentId");
    const query: any = await httpClient.delete(
      `/checklist/comment/${commentId}`
    );
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
