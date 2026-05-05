import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { supabase, UPLOADS_BUCKET } from "@/lib/supabase";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Dosya bulunamadı." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Dosya 10MB'dan büyük." },
      { status: 413 }
    );
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Sadece .jpg, .jpeg, .png, .webp, .gif, .avif kabul edilir.",
      },
      { status: 400 }
    );
  }

  const id = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${id}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    const sb = supabase();
    const { error: uploadError } = await sb.storage
      .from(UPLOADS_BUCKET)
      .upload(filename, buf, {
        contentType: file.type || undefined,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { ok: false, error: "Yükleme hatası: " + uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = sb.storage
      .from(UPLOADS_BUCKET)
      .getPublicUrl(filename);

    return NextResponse.json({ ok: true, url: urlData.publicUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
