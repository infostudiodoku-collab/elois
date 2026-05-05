"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string };

export default function MobileNav({
  items,
  brandName,
  variant,
}: {
  items: NavItem[];
  brandName: string;
  variant: "default" | "transparent";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isTransparent = variant === "transparent";

  return (
    <>
      <button
        aria-label="Menüyü aç"
        onClick={() => setOpen(true)}
        className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
      >
        <span
          className={`block w-6 h-[1.5px] ${isTransparent ? "bg-cream" : "bg-ink"}`}
        />
        <span
          className={`block w-6 h-[1.5px] ${isTransparent ? "bg-cream" : "bg-ink"}`}
        />
        <span
          className={`block w-4 h-[1.5px] ml-auto ${
            isTransparent ? "bg-cream" : "bg-ink"
          }`}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-cream text-ink animate-fadeIn"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="px-6 py-5 flex justify-between items-center border-b border-ink/10">
            <span className="font-display text-[22px] tracking-tighter">
              {brandName}
            </span>
            <button
              aria-label="Menüyü kapat"
              onClick={() => setOpen(false)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] py-2"
            >
              Kapat ×
            </button>
          </div>
          <nav className="px-6 py-12 flex flex-col gap-2">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-[44px] leading-[1.1] tracking-tighter font-light hover:italic-display transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
