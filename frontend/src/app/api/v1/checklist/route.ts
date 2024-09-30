import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../httpClient";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const taskId = searchParams.get("taskId");
    const data = await req.json();
    const query: any = await httpClient.post(`/checklist/${taskId}`, data);
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
    const checklistId = searchParams.get("checklistId");
    const query: any = await httpClient.delete(`/checklist/${checklistId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
