import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const taskId = searchParams.get("taskId");
    const query: any = await httpClient.get(`/task/${taskId}`);
    return NextResponse.json(query);
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const query: any = await httpClient.delete(`/tasks/${userId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    // trata o url pra pegar o taskid
    const urlSplit = req.nextUrl.pathname.split("/");
    const taskId = urlSplit[4];
    const query: any = await httpClient.put(`/tasks/${taskId}`, {
      ...data
    });
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
