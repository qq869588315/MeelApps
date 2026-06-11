import type { MetadataRoute } from "next";
import { getSitemapProducts } from "@/lib/product-data";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getSitemapProducts();
  const now = new Date();
  const staticPages = ["privacy", "terms", "contact"];
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

  for (const page of staticPages) {
    entries.push(
      {
        url: absoluteUrl(`/zh/${page}`),
        lastModified: now,
        alternates: {
          languages: {
            zh: absoluteUrl(`/zh/${page}`),
            en: absoluteUrl(`/en/${page}`)
          }
        }
      },
      {
        url: absoluteUrl(`/en/${page}`),
        lastModified: now,
        alternates: {
          languages: {
            zh: absoluteUrl(`/zh/${page}`),
            en: absoluteUrl(`/en/${page}`)
          }
        }
      }
    );
  }

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
