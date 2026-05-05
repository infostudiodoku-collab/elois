"use client";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
        setError(data.error || "Mesaj gönderilemedi.");
      }
    } catch {
      setStatus("error");
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-ink/30 p-8 md:p-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-4">
          Teşekkürler
        </div>
        <h3 className="font-display text-[28px] md:text-[36px] tracking-tighter font-light leading-tight mb-4">
          Mesajınız <span className="italic-display">ulaştı.</span>
        </h3>
        <p className="text-[15px] leading-relaxed opacity-80 mb-6 max-w-md">
          En kısa sürede dönüş yapacağız. Acil durumlar için doğrudan e-posta veya telefonu kullanabilirsiniz.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-mono text-[11px] uppercase tracking-[0.18em] border-b border-ink pb-1 hover:opacity-70 transition-opacity"
        >
          Yeni mesaj gönder →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Adınız" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="contact-input"
            disabled={status === "sending"}
          />
        </Field>
        <Field label="E-posta" required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="contact-input"
            disabled={status === "sending"}
          />
        </Field>
      </div>
      <Field label="Konu">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="contact-input"
          placeholder="Özel sipariş, ticari proje, basın..."
          disabled={status === "sending"}
        />
      </Field>
      <Field label="Mesajınız" required>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="contact-input resize-y"
          disabled={status === "sending"}
        />
      </Field>

      {error && (
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 md:items-center pt-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-ink text-cream font-mono text-[11px] uppercase tracking-[0.18em] px-8 py-4 hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {status === "sending" ? "Gönderiliyor…" : "Mesajı gönder →"}
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">
          Tüm alanları dikkatlice doldurun. Cevap genellikle 24 saat içinde.
        </p>
      </div>

      <style>{`
        .contact-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(26,22,20,0.3);
          padding: 12px 0;
          font-family: var(--font-body);
          font-size: 16px;
          color: #1a1614;
          transition: border-color 0.3s;
          outline: none;
        }
        .contact-input::placeholder { color: rgba(26,22,20,0.4); }
        .contact-input:focus { border-bottom-color: #1a1614; }
        .contact-input:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-1">
        {label} {required && <span className="opacity-50">·</span>}
      </div>
      {children}
    </label>
  );
}
