import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../httpClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const diagId = searchParams.get("id");
    if (!diagId) {
      const query: any = await httpClient.get("/policies");
      return NextResponse.json([...query]);
    } else {
      const query: any = await httpClient.get(`/policie/${diagId}`);
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
      const query: any = await httpClient.post("/policies", {
        ...data
      });
      return NextResponse.json({ ...query });
    } else {
      const query: any = await httpClient.post(`/policies/${policyId}`, {
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
    const query: any = await httpClient.put(`/policies/${data.id}`, {
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
    const query: any = await httpClient.delete(`/policies/${policyId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
