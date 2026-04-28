import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/front/footer";
import { Header } from "@/components/front/header";
import { buttonClass } from "@/components/ui/button";
import { MarkdownContent } from "@/lib/markdown";
import { isLocale, ui } from "@/lib/i18n";
import { getPublicProductBySlug } from "@/lib/product-data";
import { getSiteSettings } from "@/lib/settings";
import type { DocumentType, Locale } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string; slug: string; documentType: string }>;
};

function normalizeDocumentType(value: string): DocumentType | null {
  if (value === "help" || value === "privacy" || value === "terms") return value;
  return null;
}

function documentLabel(type: DocumentType, locale: Locale) {
  const t = ui[locale];
  if (type === "help") return t.docs;
  if (type === "privacy") return t.privacy;
  return t.terms;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug, documentType } = await params;
  if (!isLocale(rawLocale)) return {};
  const type = normalizeDocumentType(documentType);
  if (!type) return {};
  const product = await getPublicProductBySlug(slug, rawLocale);
  if (!product) return {};
  return {
    title: `${product.translation.name} ${documentLabel(type, rawLocale)}`,
    description: product.translation.shortDescription
  };
}

export default async function ProductDocumentPage({ params }: PageProps) {
  const { locale: rawLocale, slug, documentType } = await params;
  if (!isLocale(rawLocale)) notFound();
  const type = normalizeDocumentType(documentType);
  if (!type) notFound();
  const locale: Locale = rawLocale;
  const [product, settings] = await Promise.all([
    getPublicProductBySlug(slug, locale),
    getSiteSettings(locale)
  ]);
  if (!product) notFound();

  const document = product.documents.find(
    (item) => item.locale === locale && item.type === type
  );
  if (!document) notFound();

  if (document.contentType === "external" && document.externalUrl) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header locale={locale} />
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">
              {documentLabel(type, locale)}
            </h1>
            <p className="mt-3 text-slate-600">
              {locale === "zh" ? "该文档使用外部链接。" : "This document is hosted externally."}
            </p>
            <a href={document.externalUrl} className={buttonClass("primary", "mt-5")} target="_blank" rel="noopener noreferrer">
              {locale === "zh" ? "打开文档" : "Open document"}
            </a>
          </section>
        </main>
        <Footer locale={locale} icpNumber={settings.icpNumber} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <a
            href={`/${locale}/apps/${product.slug}`}
            className="text-sm font-medium text-blue-700 hover:text-blue-600"
          >
            ← {product.translation.name}
          </a>
          <h1 className="mt-4 text-2xl font-bold text-slate-950">
            {documentLabel(type, locale)}
          </h1>
          <div className="mt-6">
            <MarkdownContent content={document.content} />
          </div>
        </article>
      </main>
      <Footer locale={locale} icpNumber={settings.icpNumber} />
    </div>
  );
}
