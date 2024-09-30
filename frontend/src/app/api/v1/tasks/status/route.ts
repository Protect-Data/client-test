import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const taskId = searchParams.get("taskId");
    const query: any = await httpClient.put(`/task/status/${taskId}`, {
      status: data.status
    });
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
