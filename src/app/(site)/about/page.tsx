import { getContent } from "@/lib/data";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const c = await getContent();
  return (
    <div>
      <Header />
      <section className="px-6 md:px-10 pt-16 pb-12 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 mb-6">
            Stüdyo
          </div>
          <h1 className="font-display text-[44px] md:text-[68px] leading-[0.95] tracking-tightest font-light">
            {c.about.title}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9 self-end">
          <p className="text-[16px] leading-relaxed opacity-80">{c.about.lead}</p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="img-hover relative aspect-[16/9] overflow-hidden">
          <div
            className="bg absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${c.about.image})` }}
            role="img"
          />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 mt-3">
          {c.about.imageCaption}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32 max-w-5xl mx-auto">
        {c.about.sections.map((section, i) => (
          <div key={i} className="grid md:grid-cols-12 gap-8 py-10 border-t border-ink/15 first:border-t-0">
            <div className="md:col-span-4 md:sticky md:top-24 self-start">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-2">
                ¶ {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-[26px] md:text-[32px] leading-tight tracking-tighter font-light">
                {section.heading}
              </h3>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-[16px] leading-relaxed opacity-85">{section.body}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
