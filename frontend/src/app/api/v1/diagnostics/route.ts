import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../httpClient";

export async function GET(req: NextRequest) {
  try {
    const query: any = await httpClient.get("/diagnostics");
    return NextResponse.json([...query]);
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const query: any = await httpClient.post("/diagnostics", {
      ...data
    });
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
    const query: any = await httpClient.put(`/diagnostics/${data.id}`, {
      ...data
    });
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
