import type { Metadata } from "next";
import "./globals.css";
import { getContent } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const c = await getContent();
    return {
      title: c.site.brandName,
      description: c.site.tagline,
    };
  } catch {
    return {
      title: "Atölye",
      description: "Tasarım stüdyosu.",
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
