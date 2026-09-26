import type { MetadataRoute } from "next";
import { news } from "@/lib/news";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://newhausatop.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = [...new Set(news.map((n) => n.category))];
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/search`, priority: 0.6 },
    ...news.map((n) => ({ url: `${base}/news/${n.slug}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 })),
    ...categories.map((c) => ({ url: `${base}/category/${encodeURIComponent(c)}`, priority: 0.7 })),
  ];
}
