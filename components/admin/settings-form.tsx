"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/settings";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const json = await response.json().catch(() => null);
    setMessage(response.ok && json?.ok ? "已保存" : json?.error ?? "保存失败");
  }

  function field(key: keyof SiteSettings, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {message ? <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</div> : null}
      <Section title="基础设置">
        <Field label="网站名称" value={form.siteName} onChange={(value) => field("siteName", value)} />
        <Field label="默认语言" value={form.defaultLocale} onChange={(value) => field("defaultLocale", value)} />
        <Field label="ICP备案号" value={form.icpNumber} onChange={(value) => field("icpNumber", value)} />
        <Field label="联系邮箱" value={form.contactEmail} onChange={(value) => field("contactEmail", value)} />
      </Section>
      <Section title="SEO">
        <Field label="首页中文标题" value={form.homeSeoTitleZh} onChange={(value) => field("homeSeoTitleZh", value)} />
        <Field label="首页英文标题" value={form.homeSeoTitleEn} onChange={(value) => field("homeSeoTitleEn", value)} />
        <TextArea label="首页中文描述" value={form.homeSeoDescriptionZh} onChange={(value) => field("homeSeoDescriptionZh", value)} />
        <TextArea label="首页英文描述" value={form.homeSeoDescriptionEn} onChange={(value) => field("homeSeoDescriptionEn", value)} />
      </Section>
      <Section title="统计与存储">
        <Field label="Umami Website ID" value={form.umamiWebsiteId} onChange={(value) => field("umamiWebsiteId", value)} />
        <Field label="Umami Script URL" value={form.umamiScriptUrl} onChange={(value) => field("umamiScriptUrl", value)} />
        <Field label="当前存储方式" value={form.storageDriver} onChange={(value) => field("storageDriver", value)} />
        <Field label="上传目录" value={form.uploadDir} onChange={(value) => field("uploadDir", value)} />
      </Section>
      <Button>保存设置</Button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500" />
    </label>
  );
}
