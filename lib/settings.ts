import { eq, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { siteSettings, type Locale } from "@/lib/db/schema";

export const defaultSettings = {
  siteName: "Meel Apps",
  defaultLocale: "zh",
  icpNumber: "新ICP备2026002990号-1",
  contactEmail: "hello@example.com",
  homeSeoTitleZh: "Meel Apps",
  homeSeoDescriptionZh: "探索 Meel 打造的桌面工具、移动 App 和未来的插件产品。",
  homeSeoTitleEn: "Meel Apps",
  homeSeoDescriptionEn: "Explore apps and tools built by Meel.",
  umamiWebsiteId: "",
  umamiScriptUrl: "",
  storageDriver: process.env.STORAGE_DRIVER ?? "local",
  uploadDir: process.env.UPLOAD_DIR ?? "/data/uploads"
};

export type SiteSettings = typeof defaultSettings;

export async function getSiteSettings(locale?: Locale): Promise<SiteSettings> {
  const rows = locale
    ? await db
        .select()
        .from(siteSettings)
        .where(or(isNull(siteSettings.locale), eq(siteSettings.locale, locale)))
    : await db.select().from(siteSettings);

  const result: Record<string, string> = { ...defaultSettings };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  result.storageDriver = process.env.STORAGE_DRIVER ?? result.storageDriver;
  result.uploadDir = process.env.UPLOAD_DIR ?? result.uploadDir;
  return result as SiteSettings;
}

export async function saveSiteSettings(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) {
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: [siteSettings.key, siteSettings.locale],
        set: { value, updatedAt: new Date() }
      });
  }
}
