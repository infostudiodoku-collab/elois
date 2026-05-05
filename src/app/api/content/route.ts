import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, saveContent } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  try {
    const body = await req.json();
    await saveContent(body);

    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/collections");
    revalidatePath("/trade");
    revalidatePath("/contact");

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kaydedilemedi.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
