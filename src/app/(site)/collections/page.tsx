import { getContent } from "@/lib/data";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const c = await getContent();
  return (
    <div>
      <Header />
      <section className="px-6 md:px-10 pt-16 pb-12 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 mb-6">
            Katalog
          </div>
          <h1 className="font-display text-[44px] md:text-[68px] leading-[0.95] tracking-tightest font-light">
            {c.collections.title}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9 self-end">
          <p className="text-[16px] leading-relaxed opacity-80">{c.collections.lead}</p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
          {c.collections.items.map((item, i) => (
            <div key={i} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <div className="img-hover relative aspect-[4/5] overflow-hidden mb-5">
                <div
                  className="bg absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                  role="img"
                />
                <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] bg-cream/90 px-2 py-1">
                  Şek. {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="flex justify-between items-baseline gap-6">
                <h3 className="font-display text-[28px] md:text-[36px] tracking-tighter font-light leading-none">
                  {item.name}
                </h3>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                  Koleksiyon
                </div>
              </div>
              <p className="text-[15px] leading-relaxed opacity-80 mt-3 max-w-md">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
