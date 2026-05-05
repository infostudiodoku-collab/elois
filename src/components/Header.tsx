import Link from "next/link";
import { getContent } from "@/lib/data";
import MobileNav from "./MobileNav";

export default async function Header({
  variant = "default",
}: {
  variant?: "default" | "transparent";
}) {
  const content = await getContent();
  const isTransparent = variant === "transparent";

  const navItems = [
    { href: "/collections", label: content.site.nav.collections },
    { href: "/about", label: content.site.nav.studio },
    { href: "/trade", label: content.site.nav.trade },
    { href: "/contact", label: content.site.nav.contact },
  ];

  return (
    <header
      className={
        isTransparent
          ? "absolute top-0 left-0 right-0 z-40 text-cream"
          : "sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-ink/10"
      }
    >
      <div className="px-6 md:px-10 py-5 md:py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-[24px] md:text-[26px] tracking-tighter leading-none hover:italic-display transition-all"
        >
          {content.site.brandName}
        </Link>

        <nav className="hidden md:flex gap-10 lg:gap-14 items-center">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="group relative font-display text-[18px] lg:text-[20px] tracking-tight font-light leading-none"
            >
              <span className="block transition-all duration-500 group-hover:[font-style:italic] group-hover:[font-variation-settings:'opsz'_144]">
                {item.label}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div
          className={`hidden md:block font-mono text-[11px] uppercase tracking-[0.16em] ${
            isTransparent ? "opacity-80" : "opacity-60"
          }`}
        >
          ©{new Date().getFullYear()}
        </div>

        <MobileNav
          items={navItems}
          brandName={content.site.brandName}
          variant={isTransparent ? "transparent" : "default"}
        />
      </div>
    </header>
  );
}
