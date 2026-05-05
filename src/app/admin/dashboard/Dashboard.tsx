"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/data";
import ImageField from "./ImageField";
import { TextField, TextArea } from "./Fields";

type Tab = "site" | "home" | "about" | "collections" | "trade" | "contact";

const TABS: { id: Tab; label: string }[] = [
  { id: "site", label: "Site Genel" },
  { id: "home", label: "Ana Sayfa" },
  { id: "about", label: "Hakkımızda" },
  { id: "collections", label: "Koleksiyonlar" },
  { id: "trade", label: "Ticari" },
  { id: "contact", label: "İletişim" },
];

export default function Dashboard({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<Tab>("site");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [error, setError] = useState("");
  const router = useRouter();

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    const data = await res.json();
    if (data.ok) {
      setSavedAt(new Date().toLocaleTimeString("tr-TR"));
      router.refresh();
    } else {
      setError(data.error || "Kaydedilemedi.");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="sticky top-0 z-30 bg-cream border-b border-ink/15 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="font-display text-[22px] tracking-tighter">Admin</div>
          <a
            href="/admin/messages"
            className="font-mono text-[10px] uppercase tracking-[0.14em] nav-link"
          >
            Mesajlar →
          </a>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.14em] nav-link"
          >
            Siteyi gör ↗
          </a>
        </div>
        <div className="flex items-center gap-4">
          {savedAt && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
              ✓ Kaydedildi {savedAt}
            </span>
          )}
          {error && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-700">
              {error}
            </span>
          )}
          <button onClick={save} disabled={saving} className="admin-btn">
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button onClick={logout} className="admin-btn admin-btn-secondary">
            Çıkış
          </button>
        </div>
      </div>

      <div className="border-b border-ink/15 px-6 flex gap-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-3 font-mono text-[11px] uppercase tracking-[0.14em] whitespace-nowrap border-b-2 -mb-[1px] transition-colors ${
              tab === t.id ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-10 max-w-3xl mx-auto space-y-6">
        {tab === "site" && (
          <SiteTab value={content.site} onChange={(v) => update("site", v)} />
        )}
        {tab === "home" && (
          <HomeTab value={content.home} onChange={(v) => update("home", v)} />
        )}
        {tab === "about" && (
          <AboutTab value={content.about} onChange={(v) => update("about", v)} />
        )}
        {tab === "collections" && (
          <CollectionsTab value={content.collections} onChange={(v) => update("collections", v)} />
        )}
        {tab === "trade" && (
          <TradeTab value={content.trade} onChange={(v) => update("trade", v)} />
        )}
        {tab === "contact" && (
          <ContactTab value={content.contact} onChange={(v) => update("contact", v)} />
        )}
      </div>
    </div>
  );
}

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="border border-ink/15 bg-white p-6 space-y-4">
      <div>
        <h2 className="font-display text-[24px] tracking-tighter font-light">{title}</h2>
        {hint && <div className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50 mt-1">{hint}</div>}
      </div>
      {children}
    </section>
  );
}

function SiteTab({
  value,
  onChange,
}: {
  value: SiteContent["site"];
  onChange: (v: SiteContent["site"]) => void;
}) {
  const set = <K extends keyof SiteContent["site"]>(k: K, v: SiteContent["site"][K]) =>
    onChange({ ...value, [k]: v });
  const setNav = (k: keyof SiteContent["site"]["nav"], v: string) =>
    onChange({ ...value, nav: { ...value.nav, [k]: v } });

  return (
    <>
      <Section title="Marka ve İletişim">
        <TextField label="Marka Adı" value={value.brandName} onChange={(v) => set("brandName", v)} />
        <TextField label="Slogan" value={value.tagline} onChange={(v) => set("tagline", v)} />
        <TextField label="Footer Notu" value={value.footerNote} onChange={(v) => set("footerNote", v)} />
        <TextField label="E-posta" value={value.email} onChange={(v) => set("email", v)} />
        <TextField label="Instagram URL" value={value.instagram} onChange={(v) => set("instagram", v)} />
        <TextField label="Pinterest URL" value={value.pinterest} onChange={(v) => set("pinterest", v)} />
      </Section>
      <Section title="Menü İsimleri" hint="Header ve footer'da gözüken nav linkleri">
        <TextField label="Koleksiyonlar" value={value.nav.collections} onChange={(v) => setNav("collections", v)} />
        <TextField label="Stüdyo" value={value.nav.studio} onChange={(v) => setNav("studio", v)} />
        <TextField label="Ticari" value={value.nav.trade} onChange={(v) => setNav("trade", v)} />
        <TextField label="İletişim" value={value.nav.contact} onChange={(v) => setNav("contact", v)} />
      </Section>
    </>
  );
}

function HomeTab({
  value,
  onChange,
}: {
  value: SiteContent["home"];
  onChange: (v: SiteContent["home"]) => void;
}) {
  const set = <K extends keyof SiteContent["home"]>(k: K, v: SiteContent["home"][K]) =>
    onChange({ ...value, [k]: v });

  return (
    <>
      <Section title="Hero (Üst Bölüm)" hint="Sitenin ilk gözüken büyük görsel ve yazısı">
        <TextField label="Üst Etiket" value={value.heroEyebrow} onChange={(v) => set("heroEyebrow", v)} />
        <TextArea label="Başlık (yeni satır için Enter)" value={value.heroTitle} onChange={(v) => set("heroTitle", v)} rows={3} />
        <TextArea label="Açıklama" value={value.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} />
        <ImageField label="Hero Görseli" value={value.heroImage} onChange={(v) => set("heroImage", v)} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Buton Metni" value={value.heroCta} onChange={(v) => set("heroCta", v)} />
          <TextField label="Buton Linki" value={value.heroCtaLink} onChange={(v) => set("heroCtaLink", v)} />
        </div>
      </Section>

      <Section title="Marquee (Akan Yazı Bandı)" hint="Hero altındaki sürekli akan kelimeler — tek satır şeklinde, sırayla bir dik bir italik gösterilir">
        <StringList
          items={value.marquee}
          onChange={(arr) => set("marquee", arr)}
          placeholder="Kelime"
        />
      </Section>

      <ListSection
        title="İstatistikler"
        hint="Hero'nun altındaki büyük rakamlar"
        items={value.stats}
        onChange={(arr) => set("stats", arr)}
        emptyTemplate={() => ({ number: "", label: "" })}
        renderItem={(item, update) => (
          <>
            <TextField label="Rakam (örn: 150+)" value={item.number} onChange={(v) => update({ ...item, number: v })} />
            <TextField label="Etiket" value={item.label} onChange={(v) => update({ ...item, label: v })} />
          </>
        )}
      />

      <Section title="Tanıtım Bölümü">
        <TextArea label="Başlık (yeni satır için Enter)" value={value.introHeading} onChange={(v) => set("introHeading", v)} rows={3} />
        <TextArea label="Metin" value={value.introBody} onChange={(v) => set("introBody", v)} />
      </Section>

      <Section title="Öne Çıkan Ürünler — Başlık">
        <TextField label="Üst Etiket" value={value.featuredEyebrow} onChange={(v) => set("featuredEyebrow", v)} />
        <TextField label="Bölüm Başlığı" value={value.featuredHeading} onChange={(v) => set("featuredHeading", v)} />
      </Section>

      <ListSection
        title="Öne Çıkan Ürünler"
        items={value.featured}
        onChange={(arr) => set("featured", arr)}
        emptyTemplate={() => ({ title: "", description: "", image: "", link: "/collections", tag: "" })}
        renderItem={(item, update) => (
          <>
            <TextField label="Başlık" value={item.title} onChange={(v) => update({ ...item, title: v })} />
            <TextArea label="Açıklama" value={item.description} onChange={(v) => update({ ...item, description: v })} />
            <ImageField label="Görsel" value={item.image} onChange={(v) => update({ ...item, image: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Link" value={item.link} onChange={(v) => update({ ...item, link: v })} />
              <TextField label="Rozet (boş bırakılabilir)" value={item.tag} onChange={(v) => update({ ...item, tag: v })} />
            </div>
          </>
        )}
      />

      <Section title="Süreç Bölümü — Başlık">
        <TextField label="Üst Etiket" value={value.processEyebrow} onChange={(v) => set("processEyebrow", v)} />
        <TextField label="Bölüm Başlığı" value={value.processHeading} onChange={(v) => set("processHeading", v)} />
        <TextArea label="Açıklama" value={value.processBody} onChange={(v) => set("processBody", v)} />
      </Section>

      <ListSection
        title="Süreç Adımları"
        hint="Numaralı adımlar — nasıl çalıştığınızı anlatan kısa metinler"
        items={value.process}
        onChange={(arr) => set("process", arr)}
        emptyTemplate={() => ({ title: "", body: "" })}
        renderItem={(item, update) => (
          <>
            <TextField label="Başlık" value={item.title} onChange={(v) => update({ ...item, title: v })} />
            <TextArea label="Açıklama" value={item.body} onChange={(v) => update({ ...item, body: v })} rows={4} />
          </>
        )}
      />

      <Section title="Geniş Görsel">
        <ImageField label="Geniş bant görseli" value={value.wideImage} onChange={(v) => set("wideImage", v)} />
        <TextField label="Görsel altı not" value={value.wideImageCaption} onChange={(v) => set("wideImageCaption", v)} />
      </Section>

      <Section title="Lookbook — Başlık">
        <TextField label="Üst Etiket" value={value.lookbookEyebrow} onChange={(v) => set("lookbookEyebrow", v)} />
        <TextField label="Bölüm Başlığı" value={value.lookbookHeading} onChange={(v) => set("lookbookHeading", v)} />
        <TextArea label="Açıklama" value={value.lookbookBody} onChange={(v) => set("lookbookBody", v)} />
      </Section>

      <ListSection
        title="Lookbook Görselleri"
        hint="Asimetrik galeri — büyük (large) veya küçük (small) seçilebilir"
        items={value.lookbook}
        onChange={(arr) => set("lookbook", arr)}
        emptyTemplate={() => ({ image: "", caption: "", size: "small" as const })}
        renderItem={(item, update) => (
          <>
            <ImageField label="Görsel" value={item.image} onChange={(v) => update({ ...item, image: v })} />
            <TextField label="Açıklama (üzerine gelinince çıkar)" value={item.caption} onChange={(v) => update({ ...item, caption: v })} />
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] opacity-60 mb-1">
                Boyut
              </label>
              <select
                value={item.size}
                onChange={(e) => update({ ...item, size: e.target.value as "small" | "large" })}
                className="admin-input"
              >
                <option value="small">Küçük</option>
                <option value="large">Büyük</option>
              </select>
            </div>
          </>
        )}
      />

      <Section title="Müşteri Yorumları — Başlık">
        <TextField label="Bölüm Başlığı" value={value.testimonialsHeading} onChange={(v) => set("testimonialsHeading", v)} />
      </Section>

      <ListSection
        title="Müşteri Yorumları"
        items={value.testimonials}
        onChange={(arr) => set("testimonials", arr)}
        emptyTemplate={() => ({ quote: "", author: "", role: "" })}
        renderItem={(item, update) => (
          <>
            <TextArea label="Yorum" value={item.quote} onChange={(v) => update({ ...item, quote: v })} rows={4} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Yorum sahibi" value={item.author} onChange={(v) => update({ ...item, author: v })} />
              <TextField label="Mesleği / Rolü" value={item.role} onChange={(v) => update({ ...item, role: v })} />
            </div>
          </>
        )}
      />

      <Section title="Stüdyodan Notlar — Başlık">
        <TextField label="Bölüm Başlığı" value={value.journalHeading} onChange={(v) => set("journalHeading", v)} />
      </Section>

      <ListSection
        title="Stüdyodan Notlar"
        items={value.journal}
        onChange={(arr) => set("journal", arr)}
        emptyTemplate={() => ({ date: "", title: "", excerpt: "", image: "" })}
        renderItem={(item, update) => (
          <>
            <TextField label="Tarih" value={item.date} onChange={(v) => update({ ...item, date: v })} />
            <TextField label="Başlık" value={item.title} onChange={(v) => update({ ...item, title: v })} />
            <TextArea label="Özet" value={item.excerpt} onChange={(v) => update({ ...item, excerpt: v })} />
            <ImageField label="Görsel" value={item.image} onChange={(v) => update({ ...item, image: v })} />
          </>
        )}
      />

      <Section title="CTA Banner (Sayfanın sonunda)" hint="Büyük çağrı bölümü — koyu zemin üstüne yazı">
        <TextField label="Üst Etiket" value={value.ctaEyebrow} onChange={(v) => set("ctaEyebrow", v)} />
        <TextArea label="Başlık (son kelime italik olur)" value={value.ctaHeading} onChange={(v) => set("ctaHeading", v)} rows={2} />
        <TextArea label="Açıklama" value={value.ctaBody} onChange={(v) => set("ctaBody", v)} />
        <ImageField label="Arka Plan Görseli" value={value.ctaImage} onChange={(v) => set("ctaImage", v)} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Buton Metni" value={value.ctaButtonText} onChange={(v) => set("ctaButtonText", v)} />
          <TextField label="Buton Linki" value={value.ctaButtonLink} onChange={(v) => set("ctaButtonLink", v)} />
        </div>
      </Section>
    </>
  );
}

function AboutTab({
  value,
  onChange,
}: {
  value: SiteContent["about"];
  onChange: (v: SiteContent["about"]) => void;
}) {
  const set = <K extends keyof SiteContent["about"]>(k: K, v: SiteContent["about"][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <>
      <Section title="Başlık ve Görsel">
        <TextField label="Sayfa Başlığı" value={value.title} onChange={(v) => set("title", v)} />
        <TextArea label="Giriş Metni" value={value.lead} onChange={(v) => set("lead", v)} />
        <ImageField label="Ana Görsel" value={value.image} onChange={(v) => set("image", v)} />
        <TextField label="Görsel altı not" value={value.imageCaption} onChange={(v) => set("imageCaption", v)} />
      </Section>
      <ListSection
        title="Bölümler"
        items={value.sections}
        onChange={(arr) => set("sections", arr)}
        emptyTemplate={() => ({ heading: "", body: "" })}
        renderItem={(item, update) => (
          <>
            <TextField label="Başlık" value={item.heading} onChange={(v) => update({ ...item, heading: v })} />
            <TextArea label="Metin" value={item.body} onChange={(v) => update({ ...item, body: v })} rows={6} />
          </>
        )}
      />
    </>
  );
}

function CollectionsTab({
  value,
  onChange,
}: {
  value: SiteContent["collections"];
  onChange: (v: SiteContent["collections"]) => void;
}) {
  const set = <K extends keyof SiteContent["collections"]>(k: K, v: SiteContent["collections"][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <>
      <Section title="Başlık">
        <TextField label="Sayfa Başlığı" value={value.title} onChange={(v) => set("title", v)} />
        <TextArea label="Giriş Metni" value={value.lead} onChange={(v) => set("lead", v)} />
      </Section>
      <ListSection
        title="Koleksiyonlar"
        items={value.items}
        onChange={(arr) => set("items", arr)}
        emptyTemplate={() => ({ name: "", description: "", image: "" })}
        renderItem={(item, update) => (
          <>
            <TextField label="İsim" value={item.name} onChange={(v) => update({ ...item, name: v })} />
            <TextArea label="Açıklama" value={item.description} onChange={(v) => update({ ...item, description: v })} />
            <ImageField label="Görsel" value={item.image} onChange={(v) => update({ ...item, image: v })} />
          </>
        )}
      />
    </>
  );
}

function TradeTab({
  value,
  onChange,
}: {
  value: SiteContent["trade"];
  onChange: (v: SiteContent["trade"]) => void;
}) {
  const set = <K extends keyof SiteContent["trade"]>(k: K, v: SiteContent["trade"][K]) =>
    onChange({ ...value, [k]: v });

  return (
    <>
      <Section title="Başlık ve Görsel">
        <TextField label="Sayfa Başlığı" value={value.title} onChange={(v) => set("title", v)} />
        <TextArea label="Giriş Metni" value={value.lead} onChange={(v) => set("lead", v)} />
        <ImageField label="Ana Görsel" value={value.image} onChange={(v) => set("image", v)} />
        <TextArea label="Alt Metin" value={value.footer} onChange={(v) => set("footer", v)} />
      </Section>
      <Section title="Avantajlar (madde madde)">
        <StringList items={value.benefits} onChange={(arr) => set("benefits", arr)} placeholder="Avantaj metni" />
      </Section>
    </>
  );
}

function ContactTab({
  value,
  onChange,
}: {
  value: SiteContent["contact"];
  onChange: (v: SiteContent["contact"]) => void;
}) {
  const set = <K extends keyof SiteContent["contact"]>(k: K, v: SiteContent["contact"][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <Section title="İletişim Sayfası">
      <TextField label="Sayfa Başlığı" value={value.title} onChange={(v) => set("title", v)} />
      <TextArea label="Giriş Metni" value={value.lead} onChange={(v) => set("lead", v)} />
      <TextField label="Adres" value={value.address} onChange={(v) => set("address", v)} />
      <TextField label="Telefon" value={value.phone} onChange={(v) => set("phone", v)} />
      <TextField label="E-posta" value={value.email} onChange={(v) => set("email", v)} />
      <ImageField label="Görsel" value={value.image} onChange={(v) => set("image", v)} />
    </Section>
  );
}

function ListSection<T>({
  title,
  hint,
  items,
  onChange,
  renderItem,
  emptyTemplate,
}: {
  title: string;
  hint?: string;
  items: T[];
  onChange: (v: T[]) => void;
  renderItem: (item: T, update: (newItem: T) => void) => React.ReactNode;
  emptyTemplate: () => T;
}) {
  return (
    <section className="border border-ink/15 bg-white p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-display text-[24px] tracking-tighter font-light">{title}</h2>
          {hint && <div className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50 mt-1">{hint}</div>}
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, emptyTemplate()])}
          className="admin-btn admin-btn-secondary"
        >
          + Ekle
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="border-t border-ink/10 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
              ¶ {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex gap-2">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const next = [...items];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60 hover:opacity-100"
                >
                  ↑ Yukarı
                </button>
              )}
              {i < items.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const next = [...items];
                    [next[i], next[i + 1]] = [next[i + 1], next[i]];
                    onChange(next);
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60 hover:opacity-100"
                >
                  ↓ Aşağı
                </button>
              )}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-700 hover:opacity-70"
              >
                × Sil
              </button>
            </div>
          </div>
          {renderItem(item, (newItem) => {
            const next = [...items];
            next[i] = newItem;
            onChange(next);
          })}
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-[13px] opacity-60 italic-display">
          Henüz öğe yok. + Ekle ile başlayın.
        </div>
      )}
    </section>
  );
}

function StringList({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50 pt-3 w-8">
            {String(i + 1).padStart(2, "0")}
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="admin-input"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-700 pt-3"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="admin-btn admin-btn-secondary"
      >
        + Madde ekle
      </button>
    </div>
  );
}
