import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function AdminLogin() {
  if (await isAuthenticated()) {
    redirect("/admin/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream">
      <div className="max-w-sm w-full">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-3">
          Admin Paneli
        </div>
        <h1 className="font-display text-[40px] tracking-tightest font-light leading-none mb-8">
          Giriş yap
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
