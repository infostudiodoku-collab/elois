"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export default function MessagesView({ initial }: { initial: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [selected, setSelected] = useState<string | null>(initial[0]?.id ?? null);
  const router = useRouter();

  const current = messages.find((m) => m.id === selected) || null;
  const unreadCount = messages.filter((m) => !m.read).length;

  async function markRead(id: string, read: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected === id) setSelected(null);
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  function selectMessage(id: string) {
    setSelected(id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) markRead(id, true);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="sticky top-0 z-30 bg-cream border-b border-ink/15 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="font-display text-[22px] tracking-tighter">Admin</div>
          <Link
            href="/admin/dashboard"
            className="font-mono text-[10px] uppercase tracking-[0.14em] nav-link"
          >
            ← İçerik
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.14em] nav-link"
          >
            Siteyi gör ↗
          </a>
        </div>
        <button onClick={logout} className="admin-btn admin-btn-secondary">
          Çıkış
        </button>
      </div>

      <div className="border-b border-ink/15 px-6 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-[32px] tracking-tighter font-light leading-none">
            Gelen Mesajlar
          </h1>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">
            {messages.length} mesaj{unreadCount > 0 ? ` · ${unreadCount} okunmamış` : ""}
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-6 py-32">
          <div className="text-center max-w-md">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-4">
              Henüz mesaj yok
            </div>
            <p className="font-display text-[28px] tracking-tighter font-light leading-tight italic-display opacity-70">
              İletişim formundan gelen mesajlar burada listelenecek.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid md:grid-cols-12">
          {/* Liste */}
          <aside className="md:col-span-4 lg:col-span-3 border-r border-ink/15 overflow-y-auto">
            <ul>
              {messages.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => selectMessage(m.id)}
                    className={`w-full text-left px-5 py-4 border-b border-ink/10 transition-colors ${
                      selected === m.id ? "bg-bone/60" : "hover:bg-bone/30"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <div
                        className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                          m.read ? "opacity-50" : "opacity-100"
                        }`}
                      >
                        {!m.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink mr-2 align-middle" />}
                        {m.name}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-50 shrink-0">
                        {formatDate(m.createdAt)}
                      </div>
                    </div>
                    <div
                      className={`font-display text-[16px] leading-tight tracking-tight truncate ${
                        m.read ? "font-light opacity-75" : "font-medium"
                      }`}
                    >
                      {m.subject}
                    </div>
                    <div className="text-[12px] leading-snug opacity-60 mt-1 line-clamp-2">
                      {m.message}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Detay */}
          <main className="md:col-span-8 lg:col-span-9 p-6 md:p-10 overflow-y-auto">
            {current ? (
              <article className="max-w-2xl">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-2">
                      {formatDateLong(current.createdAt)}
                    </div>
                    <h2 className="font-display text-[36px] md:text-[48px] tracking-tighter font-light leading-tight">
                      {current.subject}
                    </h2>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => markRead(current.id, !current.read)}
                      className="font-mono text-[10px] uppercase tracking-[0.14em] border border-ink/30 px-3 py-2 hover:bg-ink hover:text-cream transition-colors"
                    >
                      {current.read ? "Okunmadı işaretle" : "Okundu"}
                    </button>
                    <button
                      onClick={() => remove(current.id)}
                      className="font-mono text-[10px] uppercase tracking-[0.14em] border border-red-700/50 text-red-700 px-3 py-2 hover:bg-red-700 hover:text-cream transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="border-t border-ink/15 py-5 grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-1">
                      Gönderen
                    </div>
                    <div className="text-[15px]">{current.name}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-1">
                      E-posta
                    </div>
                    <a
                      href={`mailto:${current.email}?subject=Re: ${encodeURIComponent(
                        current.subject
                      )}`}
                      className="text-[15px] nav-link break-all"
                    >
                      {current.email}
                    </a>
                  </div>
                </div>

                <div className="text-[16px] leading-[1.7] whitespace-pre-wrap">
                  {current.message}
                </div>

                <div className="mt-12 pt-6 border-t border-ink/15">
                  <a
                    href={`mailto:${current.email}?subject=${encodeURIComponent(
                      "Re: " + current.subject
                    )}`}
                    className="inline-block bg-ink text-cream font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3 hover:opacity-85 transition-opacity"
                  >
                    Cevap yaz →
                  </a>
                </div>
              </article>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50">
                  Soldan bir mesaj seçin
                </p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
