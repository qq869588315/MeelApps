import { CheckCircle2, Download, ExternalLink, Leaf, Pin } from "lucide-react";
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
  const enabledPlatforms = product.platforms.filter((platform) => platform.isEnabled);
  const hasDirectDownload = enabledPlatforms.some((platform) => platform.downloadType === "direct");
  const sourceLabel = hasDirectDownload ? t.siteDownload : t.officialExternal;
  const ownershipLabel =
    product.sourceType === "self_built" ? t.selfBuiltBadge : t.curatedBadge;
  const ownershipTone = product.sourceType === "self_built" ? "green" : "slate";
  const platformText =
    enabledPlatforms.map((platform) => formatPlatform(platform.platform)).join(" / ") || "-";
  const languageText = product.languages.map((language) => language.name).join(" / ") || "-";
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <AppIcon
            name={product.name}
            iconUrl={product.iconUrl}
            size="sm"
            colorIndex={colorIndex}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-slate-950">{product.name}</h3>
              {product.isPinned ? <Pin className="h-3.5 w-3.5 shrink-0 text-blue-600" /> : null}
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {product.categoryName ? <Badge tone="blue">{product.categoryName}</Badge> : null}
              <Badge>{formatProductType(product.productType, locale)}</Badge>
              <Badge tone={ownershipTone}>{ownershipLabel}</Badge>
              {product.isFeatured ? <Badge tone="purple">{t.recommended}</Badge> : null}
              <Badge tone={hasDirectDownload ? "orange" : "blue"}>{sourceLabel}</Badge>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {product.shortDescription}
      </p>
      <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
        <span className="font-medium text-slate-900">{locale === "zh" ? "适合：" : "Best for: "}</span>
        {useCases}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          {t.verified}
        </span>
        <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-lime-100 bg-lime-50 px-2.5 text-xs font-medium text-lime-800">
          <Leaf className="h-3.5 w-3.5 shrink-0" />
          {t.cleanEntry}
        </span>
        <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 text-xs font-medium text-blue-800">
          {hasDirectDownload ? (
            <Download className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          )}
          {sourceLabel}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-1 text-slate-500">
          <Download className="h-3.5 w-3.5 text-orange-500" />
          <span>{formatDownloadCount(product.downloadCount, locale)}</span>
        </div>
        <div className="min-w-0">
          <span className="text-slate-400">{t.platform}</span>
          <span className="ml-1 text-slate-700">{platformText}</span>
        </div>
        <div className="min-w-0">
          <span className="text-slate-400">{t.language}</span>
          <span className="ml-1 text-slate-700">{languageText}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={detailHref} className={buttonClass("secondary", "min-h-9 rounded-lg py-1.5")}>
          {t.detail}
        </a>
        <a href={`${detailHref}#versions`} className={buttonClass("primary", "min-h-9 rounded-lg py-1.5")}>
          <Download className="h-4 w-4" />
          {t.getTool}
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
