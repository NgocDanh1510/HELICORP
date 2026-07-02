import type { MetadataRoute } from "next";
import { getProducts } from "../lib/services/productService";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/san-pham`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...products.map((product) => ({
      url: `${siteUrl}/san-pham/${product.slug}.html`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
