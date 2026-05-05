import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listMessages, markAsRead, deleteMessage } from "@/lib/messages";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const messages = await listMessages();
  return NextResponse.json({ ok: true, messages });
}

export async function PATCH(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  try {
    const { id, read } = await req.json();
    if (typeof id !== "string" || typeof read !== "boolean") {
      return NextResponse.json({ ok: false, error: "Geçersiz." }, { status: 400 });
    }
    await markAsRead(id, read);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    if (typeof id !== "string") {
      return NextResponse.json({ ok: false, error: "Geçersiz." }, { status: 400 });
    }
    await deleteMessage(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }
}
