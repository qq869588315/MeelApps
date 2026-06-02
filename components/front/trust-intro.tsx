import type { Locale } from "@/lib/db/schema";
import { ui } from "@/lib/i18n";
import { SitePurposeTrigger } from "./site-purpose-trigger";

export function TrustIntro({
  locale,
  contactEmail
}: {
  locale: Locale;
  contactEmail: string;
}) {
  const t = ui[locale];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
            {t.homeHeroTitle}
          </h1>
          <p className="mt-1 max-w-5xl text-sm leading-6 text-slate-600">
            {t.homeHeroDescription}
          </p>
        </div>
        <div className="shrink-0 md:pl-4">
          <SitePurposeTrigger
            locale={locale}
            contactEmail={contactEmail}
            feedbackSubject={t.siteFeedbackSubject}
            pageUrl={`/${locale}`}
          />
        </div>
      </div>
    </section>
  );
}
