import { and, asc, count, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  categories,
  categoryTranslations,
  changelogs,
  downloadEvents,
  productDocuments,
  productLanguages,
  productMedia,
  productPlatforms,
  productTranslations,
  products,
  type BadgeType,
  type Category,
  type Changelog,
  type DocumentType,
  type DownloadType,
  type Locale,
  type Platform,
  type Product,
  type ProductDocument,
  type ProductLanguage,
  type ProductMedia,
  type ProductPlatform,
  type ProductStatus,
  type ProductTranslation,
  type ProductType
} from "@/lib/db/schema";

type CategoryView = Category & {
  name: string;
  description: string | null;
  translations?: Record<Locale, { name: string; description: string | null }>;
};

export type PublicProduct = Product & {
  translation: ProductTranslation;
  category: CategoryView | null;
  languages: ProductLanguage[];
  platforms: ProductPlatform[];
  media: ProductMedia[];
  documents: ProductDocument[];
  changelogs: Changelog[];
  downloadCount: number;
};

export type ProductAggregate = Product & {
  translations: Record<Locale, ProductTranslation | null>;
  category: CategoryView | null;
  languages: ProductLanguage[];
  platforms: ProductPlatform[];
  media: ProductMedia[];
  documents: ProductDocument[];
  changelogs: Changelog[];
  downloadCount: number;
};

export type ProductPayload = {
  slug: string;
  status: ProductStatus;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
  categoryId: number | null;
  productType: ProductType;
  iconUrl: string | null;
  translations: Record<
    Locale,
    {
      name: string;
      shortDescription: string;
      fullDescription: string;
      featureHighlights: string[];
      seoTitle?: string | null;
      seoDescription?: string | null;
    }
  >;
  languages: Array<{
    languageCode: string;
    languageNameZh: string;
    languageNameEn: string;
    sortOrder: number;
  }>;
  platforms: Array<{
    platform: Platform;
    isEnabled: boolean;
    version?: string | null;
    releaseDate?: string | null;
    fileSize?: string | null;
    minSystemRequirement?: string | null;
    downloadType: DownloadType;
    downloadUrl: string;
    storeName?: string | null;
    badgeType: BadgeType;
    checksum?: string | null;
    sortOrder: number;
  }>;
  media: Array<{
    type: "icon" | "screenshot";
    url: string;
    altText?: string | null;
    locale?: Locale | null;
    platform?: Platform | null;
    sortOrder: number;
  }>;
  documents: Array<{
    type: DocumentType;
    locale: Locale;
    contentType: "markdown" | "external";
    content?: string | null;
    externalUrl?: string | null;
  }>;
  changelogs: Array<{
    version: string;
    releaseDate: string;
    locale: Locale;
    content: string;
    isLatest: boolean;
    sortOrder: number;
  }>;
};

function byProductId<T extends { productId: number }>(rows: T[]) {
  const map = new Map<number, T[]>();
  for (const row of rows) {
    const list = map.get(row.productId) ?? [];
    list.push(row);
    map.set(row.productId, list);
  }
  return map;
}

function selectTranslation(
  rows: ProductTranslation[],
  productId: number,
  locale: Locale
) {
  const own = rows.find((row) => row.productId === productId && row.locale === locale);
  const fallback = rows.find((row) => row.productId === productId);
  return own ?? fallback ?? null;
}

function downloadCountMap(rows: Array<{ productId: number; total: number }>) {
  return new Map(rows.map((row) => [row.productId, Number(row.total)]));
}

async function fetchDownloadCounts(productIds: number[]) {
  if (productIds.length === 0) return new Map<number, number>();
  const rows = await db
    .select({
      productId: downloadEvents.productId,
      total: count(downloadEvents.id)
    })
    .from(downloadEvents)
    .where(inArray(downloadEvents.productId, productIds))
    .groupBy(downloadEvents.productId);
  return downloadCountMap(rows);
}

async function assembleProducts(
  baseProducts: Product[],
  locale: Locale
): Promise<PublicProduct[]> {
  const productIds = baseProducts.map((product) => product.id);
  if (productIds.length === 0) return [];

  const [
    translationRows,
    languageRows,
    platformRows,
    mediaRows,
    documentRows,
    changelogRows,
    categoryRows,
    categoryTranslationRows,
    counts
  ] = await Promise.all([
    db
      .select()
      .from(productTranslations)
      .where(inArray(productTranslations.productId, productIds)),
    db
      .select()
      .from(productLanguages)
      .where(inArray(productLanguages.productId, productIds))
      .orderBy(asc(productLanguages.sortOrder), asc(productLanguages.id)),
    db
      .select()
      .from(productPlatforms)
      .where(inArray(productPlatforms.productId, productIds))
      .orderBy(asc(productPlatforms.sortOrder), asc(productPlatforms.id)),
    db
      .select()
      .from(productMedia)
      .where(inArray(productMedia.productId, productIds))
      .orderBy(asc(productMedia.sortOrder), asc(productMedia.id)),
    db
      .select()
      .from(productDocuments)
      .where(inArray(productDocuments.productId, productIds)),
    db
      .select()
      .from(changelogs)
      .where(inArray(changelogs.productId, productIds))
      .orderBy(desc(changelogs.isLatest), desc(changelogs.releaseDate), asc(changelogs.sortOrder)),
    db.select().from(categories),
    db.select().from(categoryTranslations),
    fetchDownloadCounts(productIds)
  ]);

  const languageMap = byProductId(languageRows);
  const platformMap = byProductId(platformRows);
  const mediaMap = byProductId(mediaRows);
  const documentMap = byProductId(documentRows);
  const changelogMap = byProductId(changelogRows);
  const categoryMap = new Map(categoryRows.map((category) => [category.id, category]));
  const categoryTranslationsById = new Map<
    number,
    Record<Locale, { name: string; description: string | null }>
  >();

  for (const row of categoryTranslationRows) {
    const existing = categoryTranslationsById.get(row.categoryId) ?? ({} as Record<
      Locale,
      { name: string; description: string | null }
    >);
    existing[row.locale] = { name: row.name, description: row.description };
    categoryTranslationsById.set(row.categoryId, existing);
  }

  return baseProducts
    .map((product) => {
      const translation = selectTranslation(translationRows, product.id, locale);
      if (!translation) return null;
      const category = product.categoryId ? categoryMap.get(product.categoryId) : null;
      const categoryTranslations = product.categoryId
        ? categoryTranslationsById.get(product.categoryId)
        : undefined;
      const categoryLocale =
        categoryTranslations?.[locale] ?? categoryTranslations?.zh ?? categoryTranslations?.en;

      return {
        ...product,
        translation,
        category:
          category && categoryLocale
            ? {
                ...category,
                name: categoryLocale.name,
                description: categoryLocale.description,
                translations: categoryTranslations
              }
            : null,
        languages: languageMap.get(product.id) ?? [],
        platforms: platformMap.get(product.id) ?? [],
        media: mediaMap.get(product.id) ?? [],
        documents: documentMap.get(product.id) ?? [],
        changelogs: changelogMap.get(product.id) ?? [],
        downloadCount: counts.get(product.id) ?? 0
      };
    })
    .filter(Boolean) as PublicProduct[];
}

export async function getPublicProducts(locale: Locale) {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.status, "published"))
    .orderBy(
      desc(products.isPinned),
      desc(products.isFeatured),
      desc(products.sortOrder),
      desc(products.updatedAt)
    );
  return assembleProducts(rows, locale);
}

export async function getPublicProductBySlug(slug: string, locale: Locale) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, "published")))
    .limit(1);
  if (!product) return null;
  const [assembled] = await assembleProducts([product], locale);
  return assembled ?? null;
}

export async function getRelatedProducts(product: PublicProduct, locale: Locale) {
  if (!product.categoryId) return [];
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.status, "published"),
        ne(products.id, product.id),
        eq(products.categoryId, product.categoryId)
      )
    )
    .orderBy(desc(products.isFeatured), desc(products.sortOrder), desc(products.updatedAt))
    .limit(3);
  return assembleProducts(rows, locale);
}

export async function getEnabledCategories(locale: Locale) {
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      sortOrder: categories.sortOrder,
      isEnabled: categories.isEnabled,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      name: categoryTranslations.name,
      description: categoryTranslations.description
    })
    .from(categories)
    .innerJoin(
      categoryTranslations,
      and(
        eq(categoryTranslations.categoryId, categories.id),
        eq(categoryTranslations.locale, locale)
      )
    )
    .where(eq(categories.isEnabled, true))
    .orderBy(asc(categories.sortOrder), asc(categories.id));

  return rows;
}

export async function getAllCategories() {
  const [categoryRows, translationRows] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
    db.select().from(categoryTranslations)
  ]);
  return categoryRows.map((category) => {
    const translations = translationRows.filter((row) => row.categoryId === category.id);
    return {
      ...category,
      translations: {
        zh: translations.find((row) => row.locale === "zh") ?? null,
        en: translations.find((row) => row.locale === "en") ?? null
      }
    };
  });
}

export async function getAdminProducts(status?: ProductStatus) {
  const condition = status
    ? eq(products.status, status)
    : ne(products.status, "deleted");
  const rows = await db
    .select()
    .from(products)
    .where(condition)
    .orderBy(desc(products.updatedAt), desc(products.id));
  const assembled = await assembleProducts(rows, "zh");
  const translationRows = rows.length
    ? await db
        .select()
        .from(productTranslations)
        .where(inArray(productTranslations.productId, rows.map((row) => row.id)))
    : [];
  return assembled.map((product) => ({
    ...product,
    translations: {
      zh: translationRows.find((row) => row.productId === product.id && row.locale === "zh") ?? null,
      en: translationRows.find((row) => row.productId === product.id && row.locale === "en") ?? null
    }
  }));
}

export async function getProductAggregate(id: number): Promise<ProductAggregate | null> {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) return null;
  const assembled = await assembleProducts([product], "zh");
  const publicProduct = assembled[0];
  if (!publicProduct) {
    return null;
  }
  const translationRows = await db
    .select()
    .from(productTranslations)
    .where(eq(productTranslations.productId, product.id));
  return {
    ...publicProduct,
    translations: {
      zh: translationRows.find((row) => row.locale === "zh") ?? null,
      en: translationRows.find((row) => row.locale === "en") ?? null
    }
  };
}

export async function saveCategory(input: {
  id?: number;
  slug: string;
  sortOrder: number;
  isEnabled: boolean;
  zhName: string;
  enName: string;
}) {
  const now = new Date();
  const [category] = input.id
    ? await db
        .update(categories)
        .set({
          slug: input.slug,
          sortOrder: input.sortOrder,
          isEnabled: input.isEnabled,
          updatedAt: now
        })
        .where(eq(categories.id, input.id))
        .returning()
    : await db
        .insert(categories)
        .values({
          slug: input.slug,
          sortOrder: input.sortOrder,
          isEnabled: input.isEnabled
        })
        .returning();

  await Promise.all(
    ([
      ["zh", input.zhName],
      ["en", input.enName]
    ] as const).map(([locale, name]) =>
      db
        .insert(categoryTranslations)
        .values({
          categoryId: category.id,
          locale,
          name,
          description: null
        })
        .onConflictDoUpdate({
          target: [categoryTranslations.categoryId, categoryTranslations.locale],
          set: { name, description: null }
        })
    )
  );

  return category;
}

export async function saveProductAggregate(payload: ProductPayload, id?: number) {
  const now = new Date();
  return db.transaction(async (tx) => {
    const [product] = id
      ? await tx
          .update(products)
          .set({
            slug: payload.slug,
            status: payload.status,
            isFeatured: payload.isFeatured,
            isPinned: payload.isPinned,
            sortOrder: payload.sortOrder,
            categoryId: payload.categoryId,
            productType: payload.productType,
            iconUrl: payload.iconUrl,
            updatedAt: now,
            publishedAt:
              payload.status === "published" ? now : payload.status === "draft" ? null : undefined,
            hiddenAt: payload.status === "hidden" ? now : undefined,
            deletedAt: payload.status === "deleted" ? now : undefined
          })
          .where(eq(products.id, id))
          .returning()
      : await tx
          .insert(products)
          .values({
            slug: payload.slug,
            status: payload.status,
            isFeatured: payload.isFeatured,
            isPinned: payload.isPinned,
            sortOrder: payload.sortOrder,
            categoryId: payload.categoryId,
            productType: payload.productType,
            iconUrl: payload.iconUrl,
            publishedAt: payload.status === "published" ? now : null,
            hiddenAt: payload.status === "hidden" ? now : null,
            deletedAt: payload.status === "deleted" ? now : null
          })
          .returning();

    await tx.delete(productTranslations).where(eq(productTranslations.productId, product.id));
    await tx.delete(productLanguages).where(eq(productLanguages.productId, product.id));
    await tx.delete(productPlatforms).where(eq(productPlatforms.productId, product.id));
    await tx.delete(productMedia).where(eq(productMedia.productId, product.id));
    await tx.delete(productDocuments).where(eq(productDocuments.productId, product.id));
    await tx.delete(changelogs).where(eq(changelogs.productId, product.id));

    await tx.insert(productTranslations).values(
      (["zh", "en"] as const).map((locale) => ({
        productId: product.id,
        locale,
        name: payload.translations[locale].name,
        shortDescription: payload.translations[locale].shortDescription,
        fullDescription: payload.translations[locale].fullDescription,
        featureHighlights: payload.translations[locale].featureHighlights,
        seoTitle: payload.translations[locale].seoTitle ?? null,
        seoDescription: payload.translations[locale].seoDescription ?? null
      }))
    );

    if (payload.languages.length) {
      await tx.insert(productLanguages).values(
        payload.languages.map((language) => ({
          productId: product.id,
          ...language
        }))
      );
    }

    if (payload.platforms.length) {
      await tx.insert(productPlatforms).values(
        payload.platforms.map((platform) => ({
          productId: product.id,
          ...platform
        }))
      );
    }

    const mediaValues = payload.media.length
      ? payload.media
      : payload.iconUrl
        ? [
            {
              type: "icon" as const,
              url: payload.iconUrl,
              altText: payload.translations.zh.name,
              locale: null,
              platform: null,
              sortOrder: 0
            }
          ]
        : [];
    if (mediaValues.length) {
      await tx.insert(productMedia).values(
        mediaValues.map((media) => ({
          productId: product.id,
          ...media
        }))
      );
    }

    if (payload.documents.length) {
      await tx.insert(productDocuments).values(
        payload.documents.map((document) => ({
          productId: product.id,
          ...document
        }))
      );
    }

    const latestSeen = new Set<string>();
    if (payload.changelogs.length) {
      await tx.insert(changelogs).values(
        payload.changelogs.map((log) => {
          const latestKey = log.locale;
          const isLatest = log.isLatest && !latestSeen.has(latestKey);
          if (isLatest) latestSeen.add(latestKey);
          return {
            productId: product.id,
            ...log,
            isLatest
          };
        })
      );
    }

    return product;
  });
}

export async function setProductAction(id: number, action: "publish" | "hide" | "restore") {
  const now = new Date();
  const values =
    action === "hide"
      ? { status: "hidden" as const, hiddenAt: now, updatedAt: now }
      : { status: "published" as const, publishedAt: now, hiddenAt: null, updatedAt: now };

  const [product] = await db
    .update(products)
    .set(values)
    .where(eq(products.id, id))
    .returning();
  return product;
}

export async function softDeleteProduct(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) throw new Error("Product not found");
  if (product.status === "published") {
    throw new Error("Published products must be hidden before deletion");
  }
  const [updated] = await db
    .update(products)
    .set({ status: "deleted", deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return updated;
}

export async function findPlatformForDownload(platformId: number) {
  const [row] = await db
    .select({
      platform: productPlatforms,
      product: products
    })
    .from(productPlatforms)
    .innerJoin(products, eq(productPlatforms.productId, products.id))
    .where(and(eq(productPlatforms.id, platformId), eq(productPlatforms.isEnabled, true)))
    .limit(1);
  return row ?? null;
}

export async function getDashboardStats() {
  const [productRows, downloadRows, productRank, platformRank, recent] = await Promise.all([
    db
      .select({ status: products.status, total: count(products.id) })
      .from(products)
      .where(ne(products.status, "deleted"))
      .groupBy(products.status),
    db.select({ total: count(downloadEvents.id) }).from(downloadEvents),
    db
      .select({
        productId: downloadEvents.productId,
        name: productTranslations.name,
        total: count(downloadEvents.id)
      })
      .from(downloadEvents)
      .innerJoin(productTranslations, eq(productTranslations.productId, downloadEvents.productId))
      .where(eq(productTranslations.locale, "zh"))
      .groupBy(downloadEvents.productId, productTranslations.name)
      .orderBy(desc(count(downloadEvents.id)))
      .limit(10),
    db
      .select({
        platform: downloadEvents.platform,
        total: count(downloadEvents.id)
      })
      .from(downloadEvents)
      .groupBy(downloadEvents.platform)
      .orderBy(desc(count(downloadEvents.id)))
      .limit(10),
    db
      .select({
        id: downloadEvents.id,
        productId: downloadEvents.productId,
        productName: productTranslations.name,
        platform: downloadEvents.platform,
        downloadType: downloadEvents.downloadType,
        createdAt: downloadEvents.createdAt
      })
      .from(downloadEvents)
      .innerJoin(productTranslations, eq(productTranslations.productId, downloadEvents.productId))
      .where(eq(productTranslations.locale, "zh"))
      .orderBy(desc(downloadEvents.createdAt))
      .limit(20)
  ]);

  const statusCounts = {
    total: 0,
    published: 0,
    draft: 0,
    hidden: 0
  };
  for (const row of productRows) {
    const total = Number(row.total);
    statusCounts.total += total;
    if (row.status === "published") statusCounts.published = total;
    if (row.status === "draft") statusCounts.draft = total;
    if (row.status === "hidden") statusCounts.hidden = total;
  }

  return {
    products: statusCounts,
    downloads: Number(downloadRows[0]?.total ?? 0),
    productRank: productRank.map((row) => ({ ...row, total: Number(row.total) })),
    platformRank: platformRank.map((row) => ({ ...row, total: Number(row.total) })),
    recent
  };
}

export async function getSitemapProducts() {
  return db
    .select({
      slug: products.slug,
      updatedAt: products.updatedAt
    })
    .from(products)
    .where(eq(products.status, "published"))
    .orderBy(desc(products.updatedAt));
}

export async function touchDownloadEvent(input: {
  productId: number;
  platform: Platform;
  downloadType: DownloadType;
  downloadUrl: string;
  locale: Locale;
  userAgent: string | null;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  detectedOs: "windows" | "macos" | "ios" | "android" | "unknown";
  referer: string | null;
  ipHash: string | null;
}) {
  await db.insert(downloadEvents).values(input);
}
