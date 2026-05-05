import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  try {
    const body = await req.json();
    await saveContent(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Kaydedilemedi." }, { status: 400 });
  }
}
