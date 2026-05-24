import { Download, Pin } from "lucide-react";
import type { Locale } from "@/lib/db/schema";
import { formatPlatform, formatProductType, ui } from "@/lib/i18n";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { formatDownloadCount } from "./download-count";
import type { ProductCardView } from "./types";

export function ProductCard({
  product,
  locale,
  colorIndex = 0
}: {
  product: ProductCardView;
  locale: Locale;
  colorIndex?: number;
}) {
  const t = ui[locale];
  const detailHref = `/${locale}/apps/${product.slug}`;
  const useCases = buildUseCases(product, locale);
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <AppIcon
            name={product.name}
            iconUrl={product.iconUrl}
            colorIndex={colorIndex}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-slate-950">{product.name}</h3>
              {product.isPinned ? <Pin className="h-3.5 w-3.5 shrink-0 text-blue-600" /> : null}
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {product.categoryName ? <Badge tone="blue">{product.categoryName}</Badge> : null}
              <Badge>{formatProductType(product.productType, locale)}</Badge>
              {product.isFeatured ? <Badge tone="purple">{t.recommended}</Badge> : null}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
        {product.shortDescription}
      </p>
      <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
        <span className="font-medium text-slate-900">{locale === "zh" ? "适合：" : "Best for: "}</span>
        {useCases}
      </div>
      <div className="mt-4 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Download className="h-3.5 w-3.5 text-orange-500" />
          <span>{formatDownloadCount(product.downloadCount, locale)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 text-slate-400">{t.platform}</span>
          {product.platforms
            .filter((platform) => platform.isEnabled)
            .map((platform) => (
              <Badge key={platform.id}>{formatPlatform(platform.platform)}</Badge>
            ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 text-slate-400">{t.language}</span>
          {product.languages.map((language) => (
            <Badge key={language.code} tone="green">
              {language.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <a href={detailHref} className={buttonClass("secondary", "rounded-lg")}>
          {t.detail}
        </a>
        <a href={`${detailHref}#versions`} className={buttonClass("primary", "rounded-lg")}>
          <Download className="h-4 w-4" />
          {t.download}
        </a>
      </div>
    </article>
  );
}

function buildUseCases(product: ProductCardView, locale: Locale) {
  const name = product.name.toLowerCase();
  const category = product.categoryName ?? "";
  const desktop = product.productType === "desktop";
  const mobile = product.productType === "mobile";

  if (name.includes("focus")) {
    return locale === "zh" ? "任务整理、专注工作、桌面效率" : "task planning, focus work, desktop productivity";
  }
  if (name.includes("clip")) {
    return locale === "zh" ? "灵感收集、链接保存、移动整理" : "capturing ideas, saving links, mobile collection";
  }
  if (name.includes("note")) {
    return locale === "zh" ? "私密记录、临时信息、移动笔记" : "private notes, temporary info, mobile writing";
  }
  if (name.includes("timer")) {
    return locale === "zh" ? "番茄钟、会议提醒、短任务计时" : "focus timers, meeting reminders, short tasks";
  }
  if (name.includes("desk")) {
    return locale === "zh" ? "桌面清理、文件归档、资料整理" : "desktop cleanup, file archiving, organizing files";
  }
  if (category.includes("效率")) {
    return locale === "zh" ? "提升日常效率和减少重复操作" : "improving daily productivity and reducing repetitive work";
  }
  if (mobile) {
    return locale === "zh" ? "移动场景下的轻量工具需求" : "lightweight utility needs on mobile";
  }
  if (desktop) {
    return locale === "zh" ? "桌面端工作流和本地工具场景" : "desktop workflows and local utility tasks";
  }
  return locale === "zh" ? "日常工具使用和个人效率场景" : "daily utility and personal productivity use cases";
}
