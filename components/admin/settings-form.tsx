"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/settings";

type Notice = {
  type: "success" | "error";
  text: string;
};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState(settings);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const json = await response.json().catch(() => null);

    setSaving(false);
    if (!response.ok || !json?.ok) {
      setNotice({ type: "error", text: json?.error ?? "保存失败，请稍后重试" });
      return;
    }
    setNotice({ type: "success", text: "设置已保存" });
  }

  function field(key: keyof SiteSettings, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {notice ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      <Section title="基础设置">
        <Field label="网站名称" value={form.siteName} onChange={(value) => field("siteName", value)} />
        <Field label="默认语言" value={form.defaultLocale} onChange={(value) => field("defaultLocale", value)} />
        <Field label="ICP备案号" value={form.icpNumber} onChange={(value) => field("icpNumber", value)} />
        <Field label="联系邮箱" value={form.contactEmail} onChange={(value) => field("contactEmail", value)} />
      </Section>

      <Section title="搜索优化">
        <Field label="首页中文标题" value={form.homeSeoTitleZh} onChange={(value) => field("homeSeoTitleZh", value)} />
        <Field label="首页英文标题" value={form.homeSeoTitleEn} onChange={(value) => field("homeSeoTitleEn", value)} />
        <TextArea label="首页中文描述" value={form.homeSeoDescriptionZh} onChange={(value) => field("homeSeoDescriptionZh", value)} />
        <TextArea label="首页英文描述" value={form.homeSeoDescriptionEn} onChange={(value) => field("homeSeoDescriptionEn", value)} />
      </Section>

      <Section
        title="统计与存储"
        description="Umami 是网站访问统计服务。站点 ID 和脚本地址用于把前台访问数据接入 Umami；如果暂时不启用统计，可以留空。"
      >
        <Field label="Umami 站点 ID" value={form.umamiWebsiteId} onChange={(value) => field("umamiWebsiteId", value)} />
        <Field label="Umami 统计脚本地址" value={form.umamiScriptUrl} onChange={(value) => field("umamiScriptUrl", value)} />
        <Field label="当前存储方式" value={form.storageDriver} onChange={(value) => field("storageDriver", value)} />
        <Field label="上传目录" value={form.uploadDir} onChange={(value) => field("uploadDir", value)} />
      </Section>

      <Button disabled={saving}>{saving ? "保存中..." : "保存设置"}</Button>
    </form>
  );
}

function Section({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </label>
  );
}
