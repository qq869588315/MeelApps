import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import type { ProductPayload } from "@/lib/product-data";
import { requireAdmin } from "@/lib/auth";
import { getAllCategories, getProductAggregate } from "@/lib/product-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [admin, product, categories] = await Promise.all([
    requireAdmin(),
    getProductAggregate(Number(id)),
    getAllCategories()
  ]);
  if (!product) notFound();
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.translations.zh?.name ?? category.slug
  }));

  return (
    <AdminShell active="/admin/products" adminEmail={admin.email}>
      <ProductForm
        initial={{
          id: product.id,
          slug: product.slug,
          status: product.status,
          isFeatured: product.isFeatured,
          isPinned: product.isPinned,
          sortOrder: product.sortOrder,
          categoryId: product.categoryId,
          productType: product.productType,
          iconUrl: product.iconUrl,
          translations: {
            zh: translationPayload(product.translations.zh),
            en: translationPayload(product.translations.en)
          },
          languages: product.languages.map((language) => ({
            languageCode: language.languageCode,
            languageNameZh: language.languageNameZh,
            languageNameEn: language.languageNameEn,
            sortOrder: language.sortOrder
          })),
          platforms: product.platforms.map((platform) => ({
            platform: platform.platform,
            isEnabled: platform.isEnabled,
            version: platform.version,
            releaseDate: platform.releaseDate,
            fileSize: platform.fileSize,
            minSystemRequirement: platform.minSystemRequirement,
            downloadType: platform.downloadType,
            downloadUrl: platform.downloadUrl,
            storeName: platform.storeName,
            badgeType: platform.badgeType,
            checksum: platform.checksum,
            sortOrder: platform.sortOrder
          })),
          media: product.media.map((media) => ({
            type: media.type,
            url: media.url,
            altText: media.altText,
            locale: media.locale,
            platform: media.platform,
            sortOrder: media.sortOrder
          })),
          documents: product.documents.map((document) => ({
            type: document.type,
            locale: document.locale,
            contentType: document.contentType,
            content: document.content,
            externalUrl: document.externalUrl
          })),
          changelogs: product.changelogs.map((log) => ({
            version: log.version,
            releaseDate: log.releaseDate,
            locale: log.locale,
            content: log.content,
            isLatest: log.isLatest,
            sortOrder: log.sortOrder
          }))
        }}
        categories={categoryOptions}
      />
    </AdminShell>
  );
}

function translationPayload(
  translation: ProductPayload["translations"]["zh"] | null
): ProductPayload["translations"]["zh"] {
  return {
    name: translation?.name ?? "",
    shortDescription: translation?.shortDescription ?? "",
    fullDescription: translation?.fullDescription ?? "",
    featureHighlights: translation?.featureHighlights ?? [],
    seoTitle: translation?.seoTitle ?? "",
    seoDescription: translation?.seoDescription ?? ""
  };
}
