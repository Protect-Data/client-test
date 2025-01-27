import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../httpClient";

export async function GET(req: NextRequest) {
  try {
    const query: any = await httpClient.get("/users");
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
    const { name, email, password, manager } = data;
    const query: any = await httpClient.post("/users", {
      name,
      email,
      password,
      manager: manager ? true : false
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
    const { name, email, manager, password, userId } = data;
    const query: any = await httpClient.put(`/users/${userId}`, {
      name,
      email,
      manager,
      password
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
    const userId = searchParams.get("userId");
    const query: any = await httpClient.delete(`/users/${userId}`);
    return NextResponse.json({ ...query });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
