"use client";

import { Globe2 } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/db/schema";
import { switchLocalePath } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale = locale === "zh" ? "en" : "zh";
  const label = locale === "zh" ? "中文" : "English";
  const nextLabel = locale === "zh" ? "English" : "中文";

  return (
    <a
      href={switchLocalePath(pathname, nextLocale)}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      aria-label={`Switch to ${nextLabel}`}
    >
      <Globe2 className="h-4 w-4" />
      {label}
    </a>
  );
}
