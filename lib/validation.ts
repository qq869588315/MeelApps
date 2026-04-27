import { z } from "zod";

const locale = z.enum(["zh", "en"]);
const platform = z.enum(["windows", "macos", "ios", "android", "web", "browser_extension"]);

export const productPayloadSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["draft", "published", "hidden", "deleted"]),
  isFeatured: z.boolean(),
  isPinned: z.boolean(),
  sortOrder: z.coerce.number().int().default(0),
  categoryId: z.coerce.number().int().nullable(),
  productType: z.enum(["desktop", "mobile", "web_plugin"]),
  iconUrl: z.string().nullable(),
  translations: z.object({
    zh: z.object({
      name: z.string().min(1),
      shortDescription: z.string().min(1),
      fullDescription: z.string().default(""),
      featureHighlights: z.array(z.string()).default([]),
      seoTitle: z.string().nullable().optional(),
      seoDescription: z.string().nullable().optional()
    }),
    en: z.object({
      name: z.string().min(1),
      shortDescription: z.string().min(1),
      fullDescription: z.string().default(""),
      featureHighlights: z.array(z.string()).default([]),
      seoTitle: z.string().nullable().optional(),
      seoDescription: z.string().nullable().optional()
    })
  }),
  languages: z.array(
    z.object({
      languageCode: z.string().min(1),
      languageNameZh: z.string().min(1),
      languageNameEn: z.string().min(1),
      sortOrder: z.coerce.number().int().default(0)
    })
  ),
  platforms: z.array(
    z.object({
      platform,
      isEnabled: z.boolean(),
      version: z.string().nullable().optional(),
      releaseDate: z.string().nullable().optional(),
      fileSize: z.string().nullable().optional(),
      minSystemRequirement: z.string().nullable().optional(),
      downloadType: z.enum(["direct", "external"]),
      downloadUrl: z.string().min(1),
      storeName: z.string().nullable().optional(),
      badgeType: z.enum([
        "app_store",
        "google_play",
        "microsoft_store",
        "direct_download",
        "custom"
      ]),
      checksum: z.string().nullable().optional(),
      sortOrder: z.coerce.number().int().default(0)
    })
  ),
  media: z.array(
    z.object({
      type: z.enum(["icon", "screenshot"]),
      url: z.string().min(1),
      altText: z.string().nullable().optional(),
      locale: locale.nullable().optional(),
      platform: platform.nullable().optional(),
      sortOrder: z.coerce.number().int().default(0)
    })
  ),
  documents: z.array(
    z.object({
      type: z.enum(["help", "privacy", "terms"]),
      locale,
      contentType: z.enum(["markdown", "external"]),
      content: z.string().nullable().optional(),
      externalUrl: z.string().nullable().optional()
    })
  ),
  changelogs: z.array(
    z.object({
      version: z.string().min(1),
      releaseDate: z.string().min(1),
      locale,
      content: z.string().min(1),
      isLatest: z.boolean(),
      sortOrder: z.coerce.number().int().default(0)
    })
  )
});

export const categoryPayloadSchema = z.object({
  id: z.coerce.number().int().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sortOrder: z.coerce.number().int().default(0),
  isEnabled: z.boolean().default(true),
  zhName: z.string().min(1),
  enName: z.string().min(1)
});
