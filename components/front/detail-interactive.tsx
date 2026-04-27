"use client";

import { Download, ExternalLink, X } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  BadgeType,
  DownloadType,
  Locale,
  Platform
} from "@/lib/db/schema";
import { formatPlatform, ui } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export type DetailPlatformView = {
  id: number;
  platform: Platform;
  version: string | null;
  releaseDate: string | null;
  fileSize: string | null;
  minSystemRequirement: string | null;
  downloadType: DownloadType;
  downloadUrl: string;
  storeName: string | null;
  badgeType: BadgeType;
  sortOrder: number;
};

export type DetailMediaView = {
  id: number;
  type: "icon" | "screenshot";
  url: string;
  altText: string | null;
  platform: Platform | null;
  sortOrder: number;
};

export type DetailChangelogView = {
  id: number;
  version: string;
  releaseDate: string;
  content: string;
  isLatest: boolean;
  sortOrder: number;
};

export function DetailInteractive({
  locale,
  platforms,
  media,
  changelogs,
  detectedOs
}: {
  locale: Locale;
  platforms: DetailPlatformView[];
  media: DetailMediaView[];
  changelogs: DetailChangelogView[];
  detectedOs: Platform | "unknown";
}) {
  const t = ui[locale];
  const orderedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => {
      const aRecommended = a.platform === detectedOs ? 1 : 0;
      const bRecommended = b.platform === detectedOs ? 1 : 0;
      return bRecommended - aRecommended || a.sortOrder - b.sortOrder || a.id - b.id;
    });
  }, [detectedOs, platforms]);

  const screenshotPlatforms = Array.from(
    new Set(
      media
        .filter((item) => item.type === "screenshot" && item.platform)
        .map((item) => item.platform as Platform)
    )
  );
  const initialPlatform =
    screenshotPlatforms.find((platform) => platform === detectedOs) ??
    screenshotPlatforms[0] ??
    "windows";
  const [activePlatform, setActivePlatform] = useState<Platform>(initialPlatform);
  const [preview, setPreview] = useState<DetailMediaView | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const latest = changelogs.find((item) => item.isLatest) ?? changelogs[0] ?? null;
  const history = changelogs.filter((item) => latest && item.id !== latest.id);
  const activeShots = media.filter(
    (item) => item.type === "screenshot" && item.platform === activePlatform
  );

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-950">{t.screenshots}</h2>
          <div className="flex flex-wrap gap-2">
            {screenshotPlatforms.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => setActivePlatform(platform)}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
                  activePlatform === platform
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {formatPlatform(platform)}
              </button>
            ))}
          </div>
        </div>
        {activeShots.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeShots.map((shot) => {
              const mobile = shot.platform === "ios" || shot.platform === "android";
              return (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => setPreview(shot)}
                  className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-left shadow-sm ${
                    mobile ? "aspect-[9/16]" : "aspect-[16/10]"
                  }`}
                >
                  <img
                    src={shot.url}
                    alt={shot.altText ?? ""}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
            {locale === "zh" ? "该平台暂无截图。" : "No screenshots for this platform yet."}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          {locale === "zh" ? "版本与系统" : "Version & System"}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[900px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[10%]" />
              <col className="w-[16%]" />
              <col className="w-[13%]" />
              <col className="w-[24%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">{t.platform}</th>
                <th className="px-4 py-3 font-medium">{t.version}</th>
                <th className="px-4 py-3 font-medium">{t.updated}</th>
                <th className="px-4 py-3 font-medium">{t.size}</th>
                <th className="px-4 py-3 font-medium">{t.requirement}</th>
                <th className="px-4 py-3 text-center font-medium">{t.download}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orderedPlatforms.map((platform) => (
                <tr key={platform.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{formatPlatform(platform.platform)}</span>
                      {platform.platform === detectedOs ? (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {t.recommended}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{platform.version || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{platform.releaseDate || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{platform.fileSize || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {platform.minSystemRequirement || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DownloadLink platform={platform} locale={locale} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">{t.whatsNew}</h2>
        {latest ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-950">
              {t.version} {latest.version} · {latest.releaseDate}
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
              {latest.content
                .split(/\n+/)
                .map((item) => item.replace(/^[-*]\s*/, "").trim())
                .filter(Boolean)
                .map((item) => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
            {history.length ? (
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={() => setShowHistory(true)}
              >
                {t.history}
              </Button>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">-</p>
        )}
      </section>

      {preview ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-900 shadow-sm"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={preview.url}
              alt={preview.altText ?? ""}
              className="max-h-[85vh] rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}

      {showHistory ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-950">
                {locale === "zh" ? "历史更新日志" : "Release History"}
              </h3>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {changelogs.map((log) => (
                <div key={log.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">
                    {t.version} {log.version} · {log.releaseDate}
                  </div>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                    {log.content
                      .split(/\n+/)
                      .map((item) => item.replace(/^[-*]\s*/, "").trim())
                      .filter(Boolean)
                      .map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DownloadLink({
  platform,
  locale
}: {
  platform: DetailPlatformView;
  locale: Locale;
}) {
  const isExternal = platform.downloadType === "external";
  return (
    <a
      href={`/api/download?platformId=${platform.id}&locale=${locale}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      {isExternal ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {ui[locale].download}
    </a>
  );
}
