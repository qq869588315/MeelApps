"use client";

import { ImageIcon, Plus, Save, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type {
  BadgeType,
  DocumentType,
  DownloadType,
  Locale,
  Platform,
  ProductSourceType,
  ProductStatus,
  ProductType
} from "@/lib/db/schema";
import type { ProductFormValue } from "@/lib/product-defaults";
import { formatPlatform } from "@/lib/i18n";

type CategoryOption = {
  id: number;
  slug: string;
  name: string;
};

const tabs = [
  ["base", "基础信息"],
  ["zh", "中文内容"],
  ["en", "英文内容"],
  ["platforms", "平台与下载"],
  ["media", "图片素材"],
  ["logs", "更新日志"],
  ["docs", "文档与政策"],
  ["seo", "搜索优化"]
] as const;

const platforms: Platform[] = ["windows", "macos", "ios", "android", "web", "browser_extension"];
const badgeTypes: BadgeType[] = [
  "direct_download",
  "app_store",
  "google_play",
  "microsoft_store",
  "custom"
];

const badgeTypeLabels: Record<BadgeType, string> = {
  direct_download: "直接下载",
  app_store: "App Store",
  google_play: "Google Play",
  microsoft_store: "Microsoft Store",
  custom: "自定义"
};
export function ProductForm({
  initial,
  categories
}: {
  initial: ProductFormValue;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [active, setActive] = useState<(typeof tabs)[number][0]>("base");
  const [form, setForm] = useState<ProductFormValue>(initial);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const title = useMemo(
    () => form.translations.zh.name || form.translations.en.name || "新建产品",
    [form.translations.en.name, form.translations.zh.name]
  );

  function patch(values: Partial<ProductFormValue>) {
    setForm((current) => ({ ...current, ...values }));
  }

  function patchTranslation(locale: Locale, values: Partial<ProductFormValue["translations"][Locale]>) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], ...values }
      }
    }));
  }

  async function upload(file: File, kind: "image" | "download") {
    const body = new FormData();
    body.set("file", file);
    body.set("kind", kind);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const json = await response.json();
    if (!response.ok || !json.ok) throw new Error(json.error ?? "上传失败");
    return json.data.url as string;
  }

  async function save(status?: ProductStatus) {
    setSaving(true);
    setMessage("");
    const payload = { ...form, status: status ?? form.status };
    const response = await fetch(
      payload.id ? `/api/admin/products/${payload.id}` : "/api/admin/products",
      {
        method: payload.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
    const json = await response.json().catch(() => null);
    setSaving(false);
    if (!response.ok || !json?.ok) {
      setMessage(json?.error ?? "保存失败");
      return;
    }
    setMessage("已保存");
    const id = payload.id ?? json.data.id;
    router.replace(`/admin/products/${id}/edit`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">编辑产品：{title}</h1>
          <p className="mt-1 text-sm text-slate-500">维护展示内容、下载入口、预览、更新日志和 SEO。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => save("draft")} disabled={saving}>
            <Save className="h-4 w-4" />
            保存草稿
          </Button>
          <Button type="button" onClick={() => save("published")} disabled={saving}>
            发布
          </Button>
          {form.status === "published" ? (
            <Button type="button" variant="secondary" onClick={() => save("hidden")} disabled={saving}>
              隐藏
            </Button>
          ) : null}
        </div>
      </div>
      {message ? (
        <div className={`rounded-2xl px-4 py-3 text-sm ${message === "已保存" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max gap-1">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`rounded-xl px-3 py-2 text-sm font-medium ${active === key ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {active === "base" ? (
        <Panel title="基础信息">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="访问标识" value={form.slug} onChange={(value) => patch({ slug: value })} />
            <Select
              label="状态"
              value={form.status}
              onChange={(value) => patch({ status: value as ProductStatus })}
              options={[
                ["draft", "草稿"],
                ["published", "已发布"],
                ["hidden", "隐藏"]
              ]}
            />
            <Select
              label="分类"
              value={String(form.categoryId ?? "")}
              onChange={(value) => patch({ categoryId: value ? Number(value) : null })}
              options={categories.map((category) => [String(category.id), category.name])}
            />
            <Select
              label="产品类型"
              value={form.productType}
              onChange={(value) => patch({ productType: value as ProductType })}
              options={[
                ["desktop", "桌面端"],
                ["mobile", "移动端"],
                ["web_plugin", "Web 插件"]
              ]}
            />
            <Select
              label="工具来源"
              value={form.sourceType}
              onChange={(value) => patch({ sourceType: value as ProductSourceType })}
              options={[
                ["self_built", "本站工具"],
                ["curated", "精选工具"]
              ]}
            />
            <Field
              label="排序权重"
              type="number"
              value={String(form.sortOrder)}
              onChange={(value) => patch({ sortOrder: Number(value) })}
            />
            <Field label="图标 URL" value={form.iconUrl ?? ""} onChange={(value) => patch({ iconUrl: value || null })} />
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.isFeatured} onChange={(event) => patch({ isFeatured: event.target.checked })} />
              推荐
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.isPinned} onChange={(event) => patch({ isPinned: event.target.checked })} />
              置顶
            </label>
          </div>
          <LanguagesEditor form={form} setForm={setForm} />
        </Panel>
      ) : null}

      {active === "zh" || active === "en" ? (
        <ContentEditor locale={active} form={form} patchTranslation={patchTranslation} />
      ) : null}

      {active === "platforms" ? (
        <PlatformsEditor form={form} setForm={setForm} upload={upload} />
      ) : null}

      {active === "media" ? (
        <MediaEditor form={form} setForm={setForm} upload={upload} />
      ) : null}

      {active === "logs" ? (
        <ChangelogEditor form={form} setForm={setForm} />
      ) : null}

      {active === "docs" ? (
        <DocumentsEditor form={form} setForm={setForm} />
      ) : null}

      {active === "seo" ? (
        <Panel title="搜索优化">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="中文 SEO 标题" value={form.translations.zh.seoTitle ?? ""} onChange={(value) => patchTranslation("zh", { seoTitle: value })} />
            <Field label="英文 SEO 标题" value={form.translations.en.seoTitle ?? ""} onChange={(value) => patchTranslation("en", { seoTitle: value })} />
            <TextArea label="中文 SEO 描述" value={form.translations.zh.seoDescription ?? ""} onChange={(value) => patchTranslation("zh", { seoDescription: value })} />
            <TextArea label="英文 SEO 描述" value={form.translations.en.seoDescription ?? ""} onChange={(value) => patchTranslation("en", { seoDescription: value })} />
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

function ContentEditor({
  locale,
  form,
  patchTranslation
}: {
  locale: Locale;
  form: ProductFormValue;
  patchTranslation: (locale: Locale, values: Partial<ProductFormValue["translations"][Locale]>) => void;
}) {
  const data = form.translations[locale];
  return (
    <Panel title={locale === "zh" ? "中文内容" : "英文内容"}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="产品名称" value={data.name} onChange={(value) => patchTranslation(locale, { name: value })} />
        <Field label="短描述" value={data.shortDescription} onChange={(value) => patchTranslation(locale, { shortDescription: value })} />
      </div>
      <TextArea label="详细描述（Markdown）" rows={8} value={data.fullDescription} onChange={(value) => patchTranslation(locale, { fullDescription: value })} />
      <TextArea
        label="功能亮点（一行一条）"
        value={data.featureHighlights.join("\n")}
        onChange={(value) =>
          patchTranslation(locale, {
            featureHighlights: value.split(/\n+/).map((item) => item.trim()).filter(Boolean)
          })
        }
      />
    </Panel>
  );
}

function LanguagesEditor({
  form,
  setForm
}: {
  form: ProductFormValue;
  setForm: React.Dispatch<React.SetStateAction<ProductFormValue>>;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-950">产品支持语言</h3>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setForm((current) => ({
              ...current,
              languages: [
                ...current.languages,
                { languageCode: "en-US", languageNameZh: "英文", languageNameEn: "English", sortOrder: current.languages.length }
              ]
            }))
          }
        >
          <Plus className="h-4 w-4" />
          添加
        </Button>
      </div>
      <div className="space-y-3">
        {form.languages.map((language, index) => (
          <div key={`${language.languageCode}-${index}`} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_1fr_1fr_90px_40px]">
            <SmallInput label="语言代码" value={language.languageCode} onChange={(value) => updateArray(setForm, "languages", index, { languageCode: value })} />
            <SmallInput label="中文名" value={language.languageNameZh} onChange={(value) => updateArray(setForm, "languages", index, { languageNameZh: value })} />
            <SmallInput label="英文名" value={language.languageNameEn} onChange={(value) => updateArray(setForm, "languages", index, { languageNameEn: value })} />
            <SmallInput label="排序" type="number" value={String(language.sortOrder)} onChange={(value) => updateArray(setForm, "languages", index, { sortOrder: Number(value) })} />
            <IconDelete onClick={() => removeArray(setForm, "languages", index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlatformsEditor({
  form,
  setForm,
  upload
}: {
  form: ProductFormValue;
  setForm: React.Dispatch<React.SetStateAction<ProductFormValue>>;
  upload: (file: File, kind: "image" | "download") => Promise<string>;
}) {
  return (
    <Panel
      title="平台与下载"
      action={
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setForm((current) => ({
              ...current,
              platforms: [
                ...current.platforms,
                {
                  platform: "windows",
                  isEnabled: true,
                  version: "1.0.0",
                  releaseDate: new Date().toISOString().slice(0, 10),
                  fileSize: "",
                  minSystemRequirement: "",
                  downloadType: "external",
                  downloadUrl: "https://example.com",
                  storeName: "",
                  badgeType: "direct_download",
                  checksum: "",
                  sortOrder: current.platforms.length * 10
                }
              ]
            }))
          }
        >
          <Plus className="h-4 w-4" />
          添加平台
        </Button>
      }
    >
      <div className="space-y-4">
        {form.platforms.map((platform, index) => (
          <div key={`${platform.platform}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-950">{platform.platform}</h3>
              <IconDelete onClick={() => removeArray(setForm, "platforms", index)} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Select label="平台" value={platform.platform} onChange={(value) => updateArray(setForm, "platforms", index, { platform: value as Platform })} options={platforms.map((item) => [item, formatPlatform(item)])} />
              <Select label="下载类型" value={platform.downloadType} onChange={(value) => updateArray(setForm, "platforms", index, { downloadType: value as DownloadType })} options={[["direct", "本站下载"], ["external", "外部链接"]]} />
              <Select label="徽章类型" value={platform.badgeType} onChange={(value) => updateArray(setForm, "platforms", index, { badgeType: value as BadgeType })} options={badgeTypes.map((item) => [item, badgeTypeLabels[item]])} />
              <Field label="版本号" value={platform.version ?? ""} onChange={(value) => updateArray(setForm, "platforms", index, { version: value })} />
              <Field label="更新时间" value={platform.releaseDate ?? ""} onChange={(value) => updateArray(setForm, "platforms", index, { releaseDate: value })} />
              <Field label="文件大小" value={platform.fileSize ?? ""} onChange={(value) => updateArray(setForm, "platforms", index, { fileSize: value })} />
              <Field label="系统要求" value={platform.minSystemRequirement ?? ""} onChange={(value) => updateArray(setForm, "platforms", index, { minSystemRequirement: value })} />
              <Field label="下载 URL" value={platform.downloadUrl} onChange={(value) => updateArray(setForm, "platforms", index, { downloadUrl: value })} />
              <Field label="平台名称" value={platform.storeName ?? ""} onChange={(value) => updateArray(setForm, "platforms", index, { storeName: value })} />
              <Field label="排序" type="number" value={String(platform.sortOrder)} onChange={(value) => updateArray(setForm, "platforms", index, { sortOrder: Number(value) })} />
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">上传安装包</span>
                <input
                  type="file"
                  className="block w-full text-sm text-slate-600"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const url = await upload(file, "download");
                    updateArray(setForm, "platforms", index, { downloadUrl: url, downloadType: "direct" });
                  }}
                />
              </label>
              <label className="mt-7 inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={platform.isEnabled} onChange={(event) => updateArray(setForm, "platforms", index, { isEnabled: event.target.checked })} />
                启用
              </label>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MediaEditor({
  form,
  setForm,
  upload
}: {
  form: ProductFormValue;
  setForm: React.Dispatch<React.SetStateAction<ProductFormValue>>;
  upload: (file: File, kind: "image" | "download") => Promise<string>;
}) {
  return (
    <Panel title="图片素材">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="主图标 URL" value={form.iconUrl ?? ""} onChange={(value) => setForm((current) => ({ ...current, iconUrl: value || null }))} />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">上传图标</span>
          <input
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const url = await upload(file, "image");
              setForm((current) => ({
                ...current,
                iconUrl: url,
                media: [
                  ...current.media.filter((item) => item.type !== "icon"),
                  { type: "icon", url, altText: current.translations.zh.name, locale: null, platform: null, sortOrder: 0 }
                ]
              }));
            }}
            className="block w-full text-sm text-slate-600"
          />
        </label>
      </div>
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-950">预览</h3>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
            <Upload className="h-4 w-4" />
            上传预览
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const url = await upload(file, "image");
                setForm((current) => ({
                  ...current,
                  media: [
                    ...current.media,
                    { type: "screenshot", url, altText: file.name, locale: null, platform: "windows", sortOrder: current.media.length * 10 }
                  ]
                }));
              }}
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {form.media.map((media, index) => (
            <div key={`${media.url}-${index}`} className="rounded-2xl border border-slate-200 p-3">
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                {media.url ? <img src={media.url} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="m-auto h-8 w-8 text-slate-400" />}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Select label="类型" value={media.type} onChange={(value) => updateArray(setForm, "media", index, { type: value as "icon" | "screenshot" })} options={[["icon", "图标"], ["screenshot", "预览"]]} />
              <Select label="平台" value={media.platform ?? ""} onChange={(value) => updateArray(setForm, "media", index, { platform: (value || null) as Platform | null })} options={[["", "无"], ...platforms.map((item) => [item, formatPlatform(item)] as [string, string])]} />
                <Field label="排序" type="number" value={String(media.sortOrder)} onChange={(value) => updateArray(setForm, "media", index, { sortOrder: Number(value) })} />
              </div>
              <Field label="Alt 文案" value={media.altText ?? ""} onChange={(value) => updateArray(setForm, "media", index, { altText: value })} />
              <Button type="button" variant="secondary" className="mt-3 text-red-700" onClick={() => removeArray(setForm, "media", index)}>
                删除图片
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ChangelogEditor({
  form,
  setForm
}: {
  form: ProductFormValue;
  setForm: React.Dispatch<React.SetStateAction<ProductFormValue>>;
}) {
  return (
    <Panel
      title="更新日志"
      action={
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setForm((current) => ({
              ...current,
              changelogs: [
                ...current.changelogs,
                {
                  version: "1.0.0",
                  releaseDate: new Date().toISOString().slice(0, 10),
                  locale: "zh",
                  content: "- 首个版本发布",
                  isLatest: current.changelogs.length === 0,
                  sortOrder: current.changelogs.length * 10
                }
              ]
            }))
          }
        >
          <Plus className="h-4 w-4" />
          添加版本
        </Button>
      }
    >
      <div className="space-y-4">
        {form.changelogs.map((log, index) => (
          <div key={`${log.version}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="版本号" value={log.version} onChange={(value) => updateArray(setForm, "changelogs", index, { version: value })} />
              <Field label="发布时间" value={log.releaseDate} onChange={(value) => updateArray(setForm, "changelogs", index, { releaseDate: value })} />
              <Select label="语言" value={log.locale} onChange={(value) => updateArray(setForm, "changelogs", index, { locale: value as Locale })} options={[["zh", "中文"], ["en", "英文"]]} />
              <label className="mt-7 inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={log.isLatest} onChange={(event) => updateArray(setForm, "changelogs", index, { isLatest: event.target.checked })} />
                最新版本
              </label>
            </div>
            <TextArea label="更新内容" value={log.content} onChange={(value) => updateArray(setForm, "changelogs", index, { content: value })} />
            <Button type="button" variant="secondary" className="mt-3 text-red-700" onClick={() => removeArray(setForm, "changelogs", index)}>
              删除
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DocumentsEditor({
  form,
  setForm
}: {
  form: ProductFormValue;
  setForm: React.Dispatch<React.SetStateAction<ProductFormValue>>;
}) {
  return (
    <Panel title="文档与政策">
      <div className="space-y-4">
        {form.documents.map((document, index) => (
          <div key={`${document.type}-${document.locale}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Select label="类型" value={document.type} onChange={(value) => updateArray(setForm, "documents", index, { type: value as DocumentType })} options={[["help", "帮助文档"], ["privacy", "隐私政策"], ["terms", "服务条款"]]} />
              <Select label="语言" value={document.locale} onChange={(value) => updateArray(setForm, "documents", index, { locale: value as Locale })} options={[["zh", "中文"], ["en", "英文"]]} />
              <Select label="内容类型" value={document.contentType} onChange={(value) => updateArray(setForm, "documents", index, { contentType: value as "markdown" | "external" })} options={[["markdown", "站内 Markdown"], ["external", "外部链接"]]} />
            </div>
            {document.contentType === "external" ? (
              <Field label="外部链接" value={document.externalUrl ?? ""} onChange={(value) => updateArray(setForm, "documents", index, { externalUrl: value })} />
            ) : (
              <TextArea label="Markdown 内容" rows={8} value={document.content ?? ""} onChange={(value) => updateArray(setForm, "documents", index, { content: value })} />
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function updateArray<K extends keyof ProductFormValue>(
  setForm: React.Dispatch<React.SetStateAction<ProductFormValue>>,
  key: K,
  index: number,
  values: Partial<ProductFormValue[K] extends Array<infer T> ? T : never>
) {
  setForm((current) => {
    const list = [...(current[key] as unknown[])] as Record<string, unknown>[];
    list[index] = { ...list[index], ...values };
    return { ...current, [key]: list };
  });
}

function removeArray<K extends keyof ProductFormValue>(
  setForm: React.Dispatch<React.SetStateAction<ProductFormValue>>,
  key: K,
  index: number
) {
  setForm((current) => {
    const list = [...(current[key] as unknown[])];
    list.splice(index, 1);
    return { ...current, [key]: list };
  });
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </label>
  );
}

function SmallInput({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function IconDelete({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-700 hover:bg-red-50"
      aria-label="删除"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
