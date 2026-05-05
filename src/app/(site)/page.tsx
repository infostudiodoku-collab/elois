import Link from "next/link";
import { getContent } from "@/lib/data";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const c = await getContent();

  return (
    <div>
      <Header variant="transparent" />

      {/* ============ HERO ============ */}
      <section className="relative img-hover overflow-hidden">
        <div
          className="bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${c.home.heroImage})` }}
          role="img"
          aria-label="Hero görseli"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        <div className="relative px-6 md:px-12 py-20 md:py-32 min-h-[88vh] md:min-h-[92vh] flex flex-col justify-end text-cream">
          <div className="max-w-3xl fade-in">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-90 mb-6">
              {c.home.heroEyebrow}
            </div>
            <h1 className="font-display text-[52px] md:text-[96px] leading-[0.95] tracking-tightest font-light">
              {c.home.heroTitle.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {i % 2 === 1 ? <span className="italic-display">{line}</span> : line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-xl text-[16px] md:text-[18px] leading-relaxed opacity-95">
              {c.home.heroSubtitle}
            </p>
            <Link
              href={c.home.heroCtaLink}
              className="mt-12 inline-block font-mono text-[12px] uppercase tracking-[0.18em] border-b border-cream pb-1 hover:opacity-70 transition-opacity"
            >
              {c.home.heroCta} →
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-cream font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
          <span>Aşağı kaydır</span>
          <span className="w-[1px] h-10 bg-cream/70" />
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="border-y border-ink/15 py-5 overflow-hidden bg-bone/40">
        <div className="marquee-track gap-12 font-display text-[26px] md:text-[34px] tracking-tightest opacity-90 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12">
              {c.home.marquee.map((word, i) => (
                <span key={i} className="flex gap-12 items-center">
                  <span className={i % 2 === 1 ? "italic-display" : ""}>{word}</span>
                  <span className="opacity-30">⌁</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-ink/10">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {c.home.stats.map((s, i) => (
              <div key={i} className="text-left md:text-center">
                <div className="font-display text-[56px] md:text-[88px] leading-none tracking-tightest font-light mb-3">
                  {s.number}
                </div>
                <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] opacity-65">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ INTRO ============ */}
      <section className="px-6 md:px-12 py-24 md:py-36 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-7 md:col-start-2">
          <h2 className="font-display text-[40px] md:text-[64px] leading-[1.02] tracking-tighter font-light whitespace-pre-line">
            {c.home.introHeading}
          </h2>
        </Reveal>
        <Reveal delay={150} className="md:col-span-3 md:col-start-9 self-end">
          <p className="text-[16px] leading-relaxed opacity-80">{c.home.introBody}</p>
        </Reveal>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="px-6 md:px-12 pb-24 md:pb-32">
        <Reveal>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 mb-3">
                {c.home.featuredEyebrow}
              </div>
              <h2 className="font-display text-[40px] md:text-[56px] tracking-tighter font-light leading-none">
                {c.home.featuredHeading}
              </h2>
            </div>
            <Link
              href="/collections"
              className="font-mono text-[11px] uppercase tracking-[0.18em] nav-link self-start md:self-end pb-1"
            >
              Tümünü gör →
            </Link>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {c.home.featured.map((item, i) => (
            <Reveal key={i} delay={i * 120}>
              <Link href={item.link} className="group block">
                <div className="img-hover relative aspect-[4/5] mb-5 overflow-hidden">
                  <div
                    className="bg absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                    role="img"
                  />
                  {item.tag && (
                    <div className="absolute top-4 left-4 bg-cream/95 backdrop-blur-sm font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5">
                      {item.tag}
                    </div>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[24px] md:text-[28px] leading-tight tracking-tighter font-light group-hover:[font-style:italic] transition-all">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 shrink-0">
                    ¶ {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed opacity-70 mt-3 max-w-md">
                  {item.description}
                </p>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                  Detayı gör →
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="px-6 md:px-12 py-24 md:py-32 bg-bone/40 border-y border-ink/10">
        <Reveal>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 mb-4">
                {c.home.processEyebrow}
              </div>
              <h2 className="font-display text-[40px] md:text-[64px] tracking-tighter font-light leading-[1.02]">
                {c.home.processHeading}
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 self-end">
              <p className="text-[16px] leading-relaxed opacity-80">{c.home.processBody}</p>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 max-w-6xl">
          {c.home.process.map((step, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="relative pt-12 border-t border-ink/30">
                <div className="absolute -top-px left-0 font-mono text-[10px] uppercase tracking-[0.18em] -translate-y-3 bg-bone/40 pr-4 opacity-60">
                  ¶ {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-[26px] md:text-[34px] leading-tight tracking-tighter font-light mb-4">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed opacity-80">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ WIDE IMAGE ============ */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <Reveal>
          <div className="img-hover relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <div
              className="bg absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${c.home.wideImage})` }}
              role="img"
            />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mt-3">
            Şek. — {c.home.wideImageCaption}
          </div>
        </Reveal>
      </section>

      {/* ============ LOOKBOOK ============ */}
      <section className="px-6 md:px-12 pb-24 md:pb-32">
        <Reveal>
          <div className="grid md:grid-cols-12 gap-10 mb-12">
            <div className="md:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 mb-4">
                {c.home.lookbookEyebrow}
              </div>
              <h2 className="font-display text-[40px] md:text-[64px] tracking-tighter font-light leading-[1.02]">
                {c.home.lookbookHeading}
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 self-end">
              <p className="text-[16px] leading-relaxed opacity-80">{c.home.lookbookBody}</p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-5 auto-rows-[140px] md:auto-rows-[180px]">
          {c.home.lookbook.map((item, i) => {
            const isLarge = item.size === "large";
            return (
              <Reveal
                key={i}
                delay={i * 80}
                className={
                  isLarge
                    ? "col-span-2 md:col-span-4 row-span-2"
                    : "col-span-1 md:col-span-2 row-span-2"
                }
              >
                <div className="relative h-full img-hover overflow-hidden group">
                  <div
                    className="bg absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                    role="img"
                  />
                  {item.caption && (
                    <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cream bg-ink/55 backdrop-blur-sm px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.caption}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-ink/10">
        <Reveal>
          <h2 className="font-display text-[40px] md:text-[56px] tracking-tighter font-light leading-none mb-16">
            {c.home.testimonialsHeading}
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
          {c.home.testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 150}>
              <figure className="relative pt-10 border-t border-ink/30">
                <div className="absolute -top-px left-0 font-display text-[60px] leading-none -translate-y-7 opacity-30 italic-display">
                  "
                </div>
                <blockquote className="font-display text-[22px] md:text-[26px] leading-[1.2] tracking-tight font-light italic-display mb-8">
                  {t.quote}
                </blockquote>
                <figcaption>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] mb-1">
                    {t.author}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-55">
                    {t.role}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ JOURNAL ============ */}
      <section className="px-6 md:px-12 pb-24 md:pb-32">
        <Reveal>
          <h2 className="font-display text-[40px] md:text-[56px] tracking-tighter font-light mb-12">
            {c.home.journalHeading}
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {c.home.journal.map((item, i) => (
            <Reveal key={i} delay={i * 120}>
              <article className="group">
                <div className="img-hover relative aspect-[4/3] mb-5 overflow-hidden">
                  <div
                    className="bg absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                    role="img"
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-2">
                  {item.date}
                </div>
                <h3 className="font-display text-[22px] md:text-[24px] leading-tight tracking-tighter font-light mb-3 group-hover:[font-style:italic] transition-all">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-relaxed opacity-70">{item.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="relative img-hover overflow-hidden mt-12">
        <div
          className="bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${c.home.ctaImage})` }}
          role="img"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative px-6 md:px-12 py-24 md:py-40 text-cream">
          <Reveal>
            <div className="max-w-3xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-80 mb-6">
                {c.home.ctaEyebrow}
              </div>
              <h2 className="font-display text-[44px] md:text-[80px] leading-[0.98] tracking-tightest font-light">
                {c.home.ctaHeading.split(" ").map((word, i, arr) => {
                  const isLast = i === arr.length - 1;
                  return (
                    <span key={i}>
                      {isLast ? <span className="italic-display">{word}</span> : word}
                      {!isLast && " "}
                    </span>
                  );
                })}
              </h2>
              <p className="mt-8 max-w-xl text-[16px] md:text-[18px] leading-relaxed opacity-90">
                {c.home.ctaBody}
              </p>
              <Link
                href={c.home.ctaButtonLink}
                className="mt-10 inline-block bg-cream text-ink font-mono text-[11px] uppercase tracking-[0.18em] px-8 py-4 hover:bg-cream/85 transition-colors"
              >
                {c.home.ctaButtonText} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
