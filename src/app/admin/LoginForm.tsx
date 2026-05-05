"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    const data = await res.json();
    if (data.ok) router.push("/admin/dashboard");
    else setError(data.error || "Giriş başarısız.");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin şifresi"
        className="admin-input"
      />
      {error && <div className="text-[12px] text-red-700">{error}</div>}
      <button type="submit" disabled={loading} className="admin-btn w-full">
        {loading ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
