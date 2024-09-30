import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../httpClient";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const taskId = searchParams.get("taskId");
    const query: any = await httpClient.post(`/files/${taskId}`, data);
    console.log("[query]", query);
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
    const fileId = searchParams.get("fileId");
    const query: any = await httpClient.delete(`/files/${fileId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
