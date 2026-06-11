import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/db/schema";
import { buttonClass } from "@/components/ui/button";
import { Footer } from "./footer";
import { Header } from "./header";

export type SiteDocumentContent = {
  badge: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
};

export function SiteDocumentPage({
  locale,
  icpNumber,
  content
}: {
  locale: Locale;
  icpNumber: string;
  content: SiteDocumentContent;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header locale={locale} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-5">
          <a
            href={`/${locale}`}
            className={buttonClass("secondary", "min-h-11 shadow-sm")}
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "zh" ? "返回 Meel Apps" : "Back to Meel Apps"}
          </a>
        </div>

        <article className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase text-blue-700">{content.badge}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {content.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {content.description}
            </p>
          </aside>

          <div className="space-y-4">
            {content.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-700" />
                  <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
                </div>
                <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer locale={locale} icpNumber={icpNumber} />
    </div>
  );
}
