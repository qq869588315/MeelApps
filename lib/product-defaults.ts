import type { Locale } from "@/lib/db/schema";
import type { ProductPayload } from "@/lib/product-data";

export type ProductFormValue = ProductPayload & { id?: number };

const documentTypes = ["help", "privacy", "terms"] as const;

export function createBlankProduct(categoryId: number | null): ProductFormValue {
  return {
    slug: "",
    status: "draft",
    isFeatured: false,
    isPinned: false,
    sortOrder: 0,
    categoryId,
    productType: "desktop",
    sourceType: "self_built",
    iconUrl: null,
    translations: {
      zh: {
        name: "",
        shortDescription: "",
        fullDescription: "",
        featureHighlights: [],
        seoTitle: "",
        seoDescription: ""
      },
      en: {
        name: "",
        shortDescription: "",
        fullDescription: "",
        featureHighlights: [],
        seoTitle: "",
        seoDescription: ""
      }
    },
    languages: [
      {
        languageCode: "zh-CN",
        languageNameZh: "中文",
        languageNameEn: "Chinese",
        sortOrder: 0
      }
    ],
    platforms: [],
    media: [],
    documents: documentTypes.flatMap((type) =>
      (["zh", "en"] as Locale[]).map((locale) => ({
        type,
        locale,
        contentType: "markdown" as const,
        content: "",
        externalUrl: ""
      }))
    ),
    changelogs: []
  };
}
