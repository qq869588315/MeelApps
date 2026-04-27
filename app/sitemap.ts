import type { MetadataRoute } from "next";
import { getSitemapProducts } from "@/lib/product-data";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getSitemapProducts();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/zh"),
      lastModified: now,
      alternates: { languages: { zh: absoluteUrl("/zh"), en: absoluteUrl("/en") } }
    },
    {
      url: absoluteUrl("/en"),
      lastModified: now,
      alternates: { languages: { zh: absoluteUrl("/zh"), en: absoluteUrl("/en") } }
    }
  ];

  for (const product of products) {
    entries.push(
      {
        url: absoluteUrl(`/zh/apps/${product.slug}`),
        lastModified: product.updatedAt,
        alternates: {
          languages: {
            zh: absoluteUrl(`/zh/apps/${product.slug}`),
            en: absoluteUrl(`/en/apps/${product.slug}`)
          }
        }
      },
      {
        url: absoluteUrl(`/en/apps/${product.slug}`),
        lastModified: product.updatedAt,
        alternates: {
          languages: {
            zh: absoluteUrl(`/zh/apps/${product.slug}`),
            en: absoluteUrl(`/en/apps/${product.slug}`)
          }
        }
      }
    );
  }

  return entries;
}
