import { supabase } from "./supabase";
import seedData from "../../data/content.json";

export type SiteContent = {
  site: {
    brandName: string;
    tagline: string;
    footerNote: string;
    instagram: string;
    pinterest: string;
    email: string;
    nav: {
      collections: string;
      studio: string;
      trade: string;
      contact: string;
    };
  };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    heroCta: string;
    heroCtaLink: string;
    marquee: string[];
    stats: { number: string; label: string }[];
    introHeading: string;
    introBody: string;
    featuredEyebrow: string;
    featuredHeading: string;
    featured: { title: string; description: string; image: string; link: string; tag: string }[];
    processEyebrow: string;
    processHeading: string;
    processBody: string;
    process: { title: string; body: string }[];
    wideImage: string;
    wideImageCaption: string;
    lookbookEyebrow: string;
    lookbookHeading: string;
    lookbookBody: string;
    lookbook: { image: string; caption: string; size: "small" | "large" }[];
    testimonialsHeading: string;
    testimonials: { quote: string; author: string; role: string }[];
    journalHeading: string;
    journal: { date: string; title: string; excerpt: string; image: string }[];
    ctaEyebrow: string;
    ctaHeading: string;
    ctaBody: string;
    ctaButtonText: string;
    ctaButtonLink: string;
    ctaImage: string;
  };
  about: {
    title: string;
    lead: string;
    image: string;
    imageCaption: string;
    sections: { heading: string; body: string }[];
  };
  collections: {
    title: string;
    lead: string;
    items: { name: string; description: string; image: string }[];
  };
  trade: {
    title: string;
    lead: string;
    image: string;
    benefits: string[];
    footer: string;
  };
  contact: {
    title: string;
    lead: string;
    address: string;
    phone: string;
    email: string;
    image: string;
  };
};

const SEED: SiteContent = seedData as unknown as SiteContent;

/**
 * Reads site content from Supabase. If no row exists yet (first time), seeds
 * the table from the bundled `data/content.json` file.
 */
export async function getContent(): Promise<SiteContent> {
  const sb = supabase();
  const { data, error } = await sb
    .from("site_content")
    .select("data")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error("İçerik okunamadı: " + error.message);
  }

  if (!data) {
    // First time — seed the table with the bundled defaults
    const { error: insertError } = await sb
      .from("site_content")
      .insert({ id: 1, data: SEED });
    if (insertError) {
      // If concurrent seed happened, just refetch
      if (!insertError.message.includes("duplicate")) {
        throw new Error("İçerik tablosuna kaydedilemedi: " + insertError.message);
      }
      const { data: again } = await sb
        .from("site_content")
        .select("data")
        .eq("id", 1)
        .maybeSingle();
      return (again?.data as SiteContent) || SEED;
    }
    return SEED;
  }

  return data.data as SiteContent;
}

export async function saveContent(content: SiteContent): Promise<void> {
  const sb = supabase();
  const { error } = await sb
    .from("site_content")
    .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });
  if (error) {
    throw new Error("İçerik kaydedilemedi: " + error.message);
  }
}
