"use client";

import { Search } from "lucide-react";
import type { Locale } from "@/lib/db/schema";
import { ui } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

export function SearchHeader({
  locale,
  query,
  setQuery
}: {
  locale: Locale;
  query: string;
  setQuery: (value: string) => void;
}) {
  const t = ui[locale];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <a href={`/${locale}`} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            M
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-950">Meel Apps</div>
            <div className="text-xs text-slate-500">{t.trustedNav}</div>
          </div>
        </a>

        <div className="mx-auto w-full max-w-3xl">
          <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm outline-none focus:ring-0"
              placeholder={t.searchPlaceholder}
            />
          </div>
        </div>

        <nav className="flex items-center">
          <LanguageSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
