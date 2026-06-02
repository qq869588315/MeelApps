"use client";

import { Mail, ShieldCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/db/schema";
import { buildFeedbackHref } from "@/lib/feedback";
import { ui } from "@/lib/i18n";

export function SitePurposeTrigger({
  locale,
  contactEmail,
  feedbackSubject,
  pageUrl
}: {
  locale: Locale;
  contactEmail: string;
  feedbackSubject?: string;
  pageUrl?: string;
}) {
  const t = ui[locale];
  const [open, setOpen] = useState(false);
  const mailHref = useMemo(
    () =>
      buildFeedbackHref({
        locale,
        contactEmail,
        subject: feedbackSubject ?? t.siteFeedbackSubject,
        pageUrl
      }),
    [contactEmail, feedbackSubject, locale, pageUrl, t.siteFeedbackSubject]
  );

  return (
    <>
      <div className="group relative inline-flex">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 text-sm font-medium text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <ShieldCheck className="h-4 w-4" />
          {t.aboutSite}
        </button>
        <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-72 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600 shadow-lg group-hover:block group-focus-within:block md:left-auto md:right-0">
          {t.aboutSiteTooltip}
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-purpose-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="site-purpose-title" className="text-lg font-semibold text-slate-950">
                    {t.aboutSiteTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">MeelApps</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>{t.aboutSiteIntro}</p>
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">{t.aboutSitePrincipleTitle}</h3>
                <p className="mt-2">{t.aboutSitePrinciple}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-950">
                <h3 className="font-semibold">{t.aboutSiteFeedbackTitle}</h3>
                <p className="mt-2">{t.aboutSiteFeedback}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {t.gotIt}
              </button>
              <a
                href={mailHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <Mail className="h-4 w-4" />
                {t.feedbackIssue}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
