import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "../../httpClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Sessão inválida", success: false });
    }
    const twofactor: any = await httpClient.get(`/auth/two-factor`);
    return NextResponse.json({ success: true, ...twofactor });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Sessão inválida", success: false });
    }
    const data = await req.json();
    const twofactor: any = await httpClient.post(`/auth/two-factor`, {
      code: data.code
    });
    if (twofactor.token) {
      cookies().set("protectdata.session", twofactor.token);
    }
    return NextResponse.json({ success: true, ...twofactor });
  } catch (err) {
    console.log("[error]", err);
    const error: any = err;
    return NextResponse.json({ error: error.message, success: false });
  }
}
