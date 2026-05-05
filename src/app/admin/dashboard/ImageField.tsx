"use client";
import { useRef, useState } from "react";

export default function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pickFile(file: File) {
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setBusy(false);
    if (data.ok) onChange(data.url);
    else setError(data.error || "Yükleme başarısız.");
  }

  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] opacity-60 mb-1">
        {label}
      </label>
      <div className="flex gap-3 items-start">
        {value && (
          <div
            className="w-24 h-24 bg-cover bg-center border border-ink/15 shrink-0"
            style={{ backgroundImage: `url(${value})` }}
          />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… veya /uploads/…"
            className="admin-input"
          />
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? "Yükleniyor…" : "Görsel yükle"}
            </button>
            {error && <span className="text-[12px] text-red-700">{error}</span>}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pickFile(f);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
