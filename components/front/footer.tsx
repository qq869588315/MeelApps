import type { Locale } from "@/lib/db/schema";
import { ui } from "@/lib/i18n";

export function Footer({
  locale,
  icpNumber
}: {
  locale: Locale;
  icpNumber: string;
}) {
  const t = ui[locale];
  const linkClass =
    "rounded-md text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2";
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-semibold text-slate-900">Meel Apps</div>
          <div className="mt-1">{t.footerTagline}</div>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
          <a className={linkClass} href={`/${locale}/privacy`}>
            {t.privacy}
          </a>
          <a className={linkClass} href={`/${locale}/terms`}>
            {t.terms}
          </a>
          <a className={linkClass} href={`/${locale}/contact`}>
            {t.contact}
          </a>
          <a className={linkClass} href="https://beian.miit.gov.cn/" rel="noreferrer" target="_blank">
            {locale === "zh" ? "ICP备案号：" : "ICP: "}
            {icpNumber}
          </a>
        </nav>
      </div>
    </footer>
  );
}
