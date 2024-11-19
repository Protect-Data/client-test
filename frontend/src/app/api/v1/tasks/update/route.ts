import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const query: any = await httpClient.put(`/task/update`, {
      ...data
    });
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
