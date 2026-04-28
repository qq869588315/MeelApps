import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/front/footer";
import { HomeShell } from "@/components/front/home-shell";
import type { ProductCardView } from "@/components/front/types";
import type { Locale } from "@/lib/db/schema";
import { getEnabledCategories, getPublicProducts } from "@/lib/product-data";
import { getSiteSettings } from "@/lib/settings";
import { isLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "zh";
  const settings = await getSiteSettings(locale);
  return {
    title: locale === "zh" ? settings.homeSeoTitleZh : settings.homeSeoTitleEn,
    description:
      locale === "zh" ? settings.homeSeoDescriptionZh : settings.homeSeoDescriptionEn,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        zh: "/zh",
        en: "/en"
      }
    },
    openGraph: {
      title: "Meel Apps",
      description:
        locale === "zh" ? settings.homeSeoDescriptionZh : settings.homeSeoDescriptionEn,
      type: "website"
    }
  };
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const [products, categories, settings] = await Promise.all([
    getPublicProducts(locale),
    getEnabledCategories(locale),
    getSiteSettings(locale)
  ]);

  const viewProducts: ProductCardView[] = products.map((product) => ({
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
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HomeShell
        locale={locale}
        products={viewProducts}
        categories={categories.map((category) => ({
          id: category.id,
          slug: category.slug,
          name: category.name
        }))}
      />
      <Footer
        locale={locale}
        icpNumber={settings.icpNumber}
      />
    </div>
  );
}
