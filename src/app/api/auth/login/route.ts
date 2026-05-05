import { NextResponse } from "next/server";
import { verifyPassword, makeSessionToken, COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (typeof password !== "string" || !verifyPassword(password)) {
      return NextResponse.json({ ok: false, error: "Şifre hatalı." }, { status: 401 });
    }
    const token = makeSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }
}
