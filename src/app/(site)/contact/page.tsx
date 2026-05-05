import { getContent } from "@/lib/data";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const c = await getContent();
  return (
    <div>
      <Header />
      <section className="px-6 md:px-12 pt-16 pb-16 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 mb-6">
            İletişim
          </div>
          <h1 className="font-display text-[44px] md:text-[88px] leading-[0.95] tracking-tightest font-light">
            {c.contact.title}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9 self-end">
          <p className="text-[16px] md:text-[18px] leading-relaxed opacity-85">{c.contact.lead}</p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="img-hover relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <div
            className="bg absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${c.contact.image})` }}
            role="img"
          />
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32 grid md:grid-cols-12 gap-12">
        {/* Sol — İletişim bilgileri */}
        <aside className="md:col-span-4 space-y-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-3">
              Atölye
            </div>
            <p className="font-display text-[20px] tracking-tight font-light leading-snug">
              {c.contact.address}
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-3">
              Telefon
            </div>
            <a
              href={`tel:${c.contact.phone}`}
              className="font-display text-[20px] tracking-tight font-light hover:italic-display transition-all"
            >
              {c.contact.phone}
            </a>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-3">
              E-posta
            </div>
            <a
              href={`mailto:${c.contact.email}`}
              className="font-display text-[20px] tracking-tight font-light hover:italic-display transition-all break-all"
            >
              {c.contact.email}
            </a>
          </div>
          <div className="pt-6 border-t border-ink/15">
            <p className="text-[14px] leading-relaxed opacity-70">
              Cevap süremiz genellikle 24 saat içindedir. Acil ticari talepler için
              doğrudan telefonla aramanızı tavsiye ederiz.
            </p>
          </div>
        </aside>

        {/* Sağ — Form */}
        <div className="md:col-span-7 md:col-start-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 mb-3">
            Form
          </div>
          <h2 className="font-display text-[32px] md:text-[44px] tracking-tighter font-light leading-[1.05] mb-10">
            Bize <span className="italic-display">yazın.</span>
          </h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
