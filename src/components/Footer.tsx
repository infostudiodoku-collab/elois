import Link from "next/link";
import { getContent } from "@/lib/data";

export default async function Footer() {
  const content = await getContent();
  const navItems = [
    { href: "/collections", label: content.site.nav.collections },
    { href: "/about", label: content.site.nav.studio },
    { href: "/trade", label: content.site.nav.trade },
    { href: "/contact", label: content.site.nav.contact },
  ];

  return (
    <footer className="mt-32 border-t border-ink/15 bg-bone/40">
      <div className="px-6 md:px-10 py-16 md:py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-display text-[44px] md:text-[72px] leading-[0.95] tracking-tightest">
            {content.site.brandName}
            <span className="italic-display block opacity-70 mt-1">— birlikte.</span>
          </div>
          <p className="mt-6 max-w-sm text-[14px] leading-relaxed opacity-75">
            {content.site.tagline}
          </p>
        </div>

        <div className="md:col-span-3 flex flex-col gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-1">
            Gezin
          </div>
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="font-display text-[20px] tracking-tight font-light leading-none hover:italic-display transition-all self-start"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="md:col-span-4 flex flex-col gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-1">
            Bize ulaşın
          </div>
          <a
            href={`mailto:${content.site.email}`}
            className="font-display text-[20px] tracking-tight font-light leading-none hover:italic-display transition-all self-start"
          >
            {content.site.email}
          </a>
          <a
            href={content.site.instagram}
            target="_blank"
            rel="noreferrer"
            className="font-display text-[20px] tracking-tight font-light leading-none hover:italic-display transition-all self-start"
          >
            Instagram
          </a>
          <a
            href={content.site.pinterest}
            target="_blank"
            rel="noreferrer"
            className="font-display text-[20px] tracking-tight font-light leading-none hover:italic-display transition-all self-start"
          >
            Pinterest
          </a>
        </div>
      </div>
      <div className="px-6 md:px-10 py-6 border-t border-ink/10 flex flex-col md:flex-row justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">
        <div>{content.site.footerNote}</div>
        <div>© {new Date().getFullYear()} — Tüm hakları saklıdır.</div>
      </div>
    </footer>
  );
}
