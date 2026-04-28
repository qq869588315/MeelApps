import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DetailInteractive } from "@/components/front/detail-interactive";
import { Footer } from "@/components/front/footer";
import { Header } from "@/components/front/header";
import { ProductCard } from "@/components/front/product-card";
import type { ProductCardView } from "@/components/front/types";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { MarkdownContent } from "@/lib/markdown";
import { detectDevice } from "@/lib/device";
import type { Locale } from "@/lib/db/schema";
import { ui, isLocale } from "@/lib/i18n";
import {
  getPublicProductBySlug,
  getRelatedProducts,
  type PublicProduct
} from "@/lib/product-data";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function productToCard(product: PublicProduct, locale: Locale): ProductCardView {
  return {
    id: product.id,
    slug: product.slug,
    name: product.translation.name,
    shortDescription: product.translation.shortDescription,
    categoryName: product.category?.name ?? null,
    categorySlug: product.category?.slug ?? null,
    productType: product.productType,
    iconUrl: product.iconUrl,
    isFeatured: product.isFeatured,
    isPinned: product.isPinned,
    sortOrder: product.sortOrder,
    updatedAt: product.updatedAt.toISOString(),
    platforms: product.platforms.map((platform) => ({
      id: platform.id,
      platform: platform.platform,
      isEnabled: platform.isEnabled
    })),
    languages: product.languages.map((language) => ({
      code: language.languageCode,
      name: locale === "zh" ? language.languageNameZh : language.languageNameEn
    }))
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const product = await getPublicProductBySlug(slug, rawLocale);
  if (!product) return {};
  return {
    title: product.translation.seoTitle || product.translation.name,
    description: product.translation.seoDescription || product.translation.shortDescription,
    alternates: {
      canonical: `/${rawLocale}/apps/${slug}`,
      languages: {
        zh: `/zh/apps/${slug}`,
        en: `/en/apps/${slug}`
      }
    },
    openGraph: {
      title: product.translation.name,
      description: product.translation.shortDescription,
      images: product.iconUrl ? [product.iconUrl] : undefined
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const [product, settings] = await Promise.all([
    getPublicProductBySlug(slug, locale),
    getSiteSettings(locale)
  ]);
  if (!product) notFound();

  const t = ui[locale];
  const headerList = await headers();
  const device = detectDevice(headerList.get("user-agent"));
  const detectedOs =
    device.detectedOs === "windows" ||
    device.detectedOs === "macos" ||
    device.detectedOs === "ios" ||
    device.detectedOs === "android"
      ? device.detectedOs
      : "unknown";
  const related = await getRelatedProducts(product, locale);
  const docs = product.documents.filter((document) => document.locale === locale);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header locale={locale} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <AppIcon
                name={product.translation.name}
                iconUrl={product.iconUrl}
                size="lg"
              />
              <div>
                <div className="flex flex-wrap gap-2">
                  {product.category ? <Badge tone="blue">{product.category.name}</Badge> : null}
                  {product.isFeatured ? <Badge tone="purple">{t.recommended}</Badge> : null}
                </div>
                <h1 className="mt-3 text-3xl font-bold text-slate-950">
                  {product.translation.name}
                </h1>
                <p className="mt-2 max-w-2xl text-slate-600">
                  {product.translation.shortDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.languages.map((language) => (
                    <Badge key={language.id} tone="green">
                      {locale === "zh" ? language.languageNameZh : language.languageNameEn}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <DetailInteractive
          locale={locale}
          detectedOs={detectedOs}
          platforms={product.platforms
            .filter((platform) => platform.isEnabled)
            .map((platform) => ({
              id: platform.id,
              platform: platform.platform,
              version: platform.version,
              releaseDate: platform.releaseDate,
              fileSize: platform.fileSize,
              minSystemRequirement: platform.minSystemRequirement,
              downloadType: platform.downloadType,
              downloadUrl: platform.downloadUrl,
              storeName: platform.storeName,
              badgeType: platform.badgeType,
              sortOrder: platform.sortOrder
            }))}
          media={product.media.map((media) => ({
            id: media.id,
            type: media.type,
            url: media.url,
            altText: media.altText,
            platform: media.platform,
            sortOrder: media.sortOrder
          }))}
          changelogs={product.changelogs
            .filter((log) => log.locale === locale)
            .map((log) => ({
              id: log.id,
              version: log.version,
              releaseDate: log.releaseDate,
              content: log.content,
              isLatest: log.isLatest,
              sortOrder: log.sortOrder
            }))}
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">{t.about}</h2>
          <div className="mt-4">
            <MarkdownContent content={product.translation.fullDescription} />
          </div>
          {product.translation.featureHighlights.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {product.translation.featureHighlights.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {docs.length ? (
          <section id="docs" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t.support}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {docs.map((document) => {
                const label =
                  document.type === "help"
                    ? t.docs
                    : document.type === "privacy"
                      ? t.privacy
                      : t.terms;
                const href =
                  document.contentType === "external" && document.externalUrl
                    ? document.externalUrl
                    : `/${locale}/apps/${product.slug}/${document.type}`;
                return (
                  <a
                    key={document.id}
                    href={href}
                    target={document.contentType === "external" ? "_blank" : undefined}
                    rel={document.contentType === "external" ? "noopener noreferrer" : undefined}
                    className={buttonClass("secondary")}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">{t.related}</h2>
          {related.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item, index) => (
                <ProductCard
                  key={item.id}
                  product={productToCard(item, locale)}
                  locale={locale}
                  colorIndex={index}
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              {locale === "zh" ? "暂无相关推荐。" : "No related apps yet."}
            </p>
          )}
        </section>

      </main>
      <Footer
        locale={locale}
        icpNumber={settings.icpNumber}
      />
    </div>
  );
}
