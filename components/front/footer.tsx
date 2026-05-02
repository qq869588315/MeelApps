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
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-semibold text-slate-900">Meel Apps</div>
          <div className="mt-1">{t.footerTagline}</div>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href={`/${locale}/apps/focus-box/privacy`}>{t.privacy}</a>
          <a href={`/${locale}/apps/focus-box/terms`}>{t.terms}</a>
          <span>{t.contact}</span>
          <a href="https://beian.miit.gov.cn/" rel="noreferrer" target="_blank">
            ICP备案号：{icpNumber}
          </a>
        </div>
      </div>
    </footer>
  );
}
