import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../httpClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const diagId = searchParams.get("id");
    if (!diagId) {
      const query: any = await httpClient.get("/terms");
      return NextResponse.json([...query]);
    } else {
      const query: any = await httpClient.get(`/term/${diagId}`);
      return NextResponse.json({ ...query });
    }
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const policyId = searchParams.get("id");
    const data = await req.json();
    if (!policyId) {
      const query: any = await httpClient.post("/terms", {
        ...data
      });
      return NextResponse.json({ ...query });
    } else {
      const query: any = await httpClient.post(`/terms/${policyId}`, {
        ...data
      });
      return NextResponse.json({ ...query });
    }
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const query: any = await httpClient.put(`/terms/${data.id}`, {
      ...data
    });
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
    const policyId = searchParams.get("id");
    const query: any = await httpClient.delete(`/terms/${policyId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
