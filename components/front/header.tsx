import { Menu } from "lucide-react";
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
            <div className="text-xs text-slate-500">apps.aameel.top</div>
          </div>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a href={`/${locale}#products`} className="hover:text-slate-950">
            {t.products}
          </a>
          <a href={`/${locale}#docs`} className="hover:text-slate-950">
            {t.docs}
          </a>
          <LanguageSwitcher locale={locale} />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} />
          <Menu className="h-6 w-6 text-slate-700" />
        </div>
      </div>
    </header>
  );
}
