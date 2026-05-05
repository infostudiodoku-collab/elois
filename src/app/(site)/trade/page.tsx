import { getContent } from "@/lib/data";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function TradePage() {
  const c = await getContent();
  return (
    <div>
      <Header />
      <section className="px-6 md:px-10 pt-16 pb-16 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 mb-6">
            Tasarımcılar için
          </div>
          <h1 className="font-display text-[44px] md:text-[72px] leading-[0.95] tracking-tightest font-light">
            {c.trade.title}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9 self-end">
          <p className="text-[16px] leading-relaxed opacity-80">{c.trade.lead}</p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="img-hover relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <div
            className="bg absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${c.trade.image})` }}
            role="img"
          />
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60">
            Avantajlar
          </div>
        </div>
        <div className="md:col-span-7">
          <ul className="divide-y divide-ink/15">
            {c.trade.benefits.map((b, i) => (
              <li key={i} className="py-5 flex gap-6 items-baseline">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 shrink-0 w-12">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[16px] leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32">
        <div className="border-t border-ink/15 pt-10 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p className="font-display text-[26px] md:text-[36px] leading-tight tracking-tighter font-light italic-display max-w-2xl">
              {c.trade.footer}
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <a
              href="/contact"
              className="inline-block font-mono text-[11px] uppercase tracking-[0.18em] bg-ink text-cream px-6 py-3 hover:opacity-85 transition-opacity"
            >
              Başvuru Yap →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
