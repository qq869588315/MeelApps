import type { Locale } from "@/lib/db/schema";

export function formatDownloadCount(count: number, locale: Locale) {
  const formatted = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en").format(count);
  if (locale === "zh") return `${formatted} 次下载`;
  return `${formatted} ${count === 1 ? "download" : "downloads"}`;
}
