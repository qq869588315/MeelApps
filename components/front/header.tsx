import type { Locale } from "@/lib/db/schema";
import { ui } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

export function Header({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href={`/${locale}`} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            M
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950">Meel Apps</div>
            <div className="text-xs text-slate-500">{t.trustedNav}</div>
          </div>
        </a>
        <nav className="flex items-center">
          <LanguageSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
