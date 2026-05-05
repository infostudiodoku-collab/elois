import { NextResponse } from "next/server";
import { addMessage } from "@/lib/messages";

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "İsim, e-posta ve mesaj zorunludur." },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Geçerli bir e-posta giriniz." },
        { status: 400 }
      );
    }
    if (name.length > 200 || subject.length > 300 || message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Mesaj çok uzun." },
        { status: 400 }
      );
    }

    // Always save to local store
    const saved = await addMessage({
      name,
      email,
      subject: subject || "(konu yok)",
      message,
    });

    // Optionally send email via Resend if configured
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
    let emailSent = false;

    if (resendKey && toEmail) {
      try {
        const html = `
          <h2 style="font-family:sans-serif">Yeni iletişim formu mesajı</h2>
          <p style="font-family:sans-serif;font-size:14px"><b>Gönderen:</b> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
          <p style="font-family:sans-serif;font-size:14px"><b>Konu:</b> ${escapeHtml(subject || "(konu yok)")}</p>
          <hr/>
          <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</p>
        `;
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: toEmail,
            reply_to: email,
            subject: `İletişim formu: ${subject || "(konu yok)"}`,
            html,
          }),
        });
        emailSent = r.ok;
      } catch {
        // Silently fail email — message is already saved
      }
    }

    return NextResponse.json({ ok: true, id: saved.id, emailSent });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }
}
