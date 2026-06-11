"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale, Platform, ProductSourceType, ProductType } from "@/lib/db/schema";
import { formatPlatform, formatProductType, ui } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { TrustIntro } from "./trust-intro";
import type { CategoryFilterView, ProductCardView } from "./types";

type SortMode = "featured" | "updated" | "name";

const platformOptions: Platform[] = [
  "windows",
  "macos",
  "ios",
  "android",
  "web",
  "browser_extension"
];
const typeOptions: ProductType[] = ["desktop", "mobile", "web_plugin"];

function compareOwnership(a: ProductCardView, b: ProductCardView) {
  return Number(b.sourceType === "self_built") - Number(a.sourceType === "self_built");
}

export function HomeClient({
  locale,
  products,
  categories,
  query,
  setQuery
}: {
  locale: Locale;
  products: ProductCardView[];
  categories: CategoryFilterView[];
  query: string;
  setQuery: (value: string) => void;
}) {
  const t = ui[locale];
  const [platform, setPlatform] = useState("all");
  const [category, setCategory] = useState("all");
  const [sourceType, setSourceType] = useState<"all" | ProductSourceType>("all");
  const [type, setType] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState<SortMode>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const languages = useMemo(() => {
    const map = new Map<string, string>();
    for (const product of products) {
      for (const language of product.languages) {
        map.set(language.code, language.name);
      }
    }
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [products]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const haystack = [
        product.name,
        product.shortDescription,
        product.categoryName ?? "",
        product.categorySlug ?? "",
        formatProductType(product.productType, locale),
        ...product.platforms.map((item) => formatPlatform(item.platform)),
        ...product.languages.map((item) => item.name)
      ]
        .join(" ")
        .toLowerCase();

      if (keyword && !haystack.includes(keyword)) return false;
      if (platform !== "all" && !product.platforms.some((item) => item.platform === platform)) {
        return false;
      }
      if (category !== "all" && product.categorySlug !== category) return false;
      if (sourceType !== "all" && product.sourceType !== sourceType) return false;
      if (type !== "all" && product.productType !== type) return false;
      if (language !== "all" && !product.languages.some((item) => item.code === language)) {
        return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      const ownershipOrder = compareOwnership(a, b);
      if (ownershipOrder) return ownershipOrder;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
      return (
        Number(b.isPinned) - Number(a.isPinned) ||
        Number(b.isFeatured) - Number(a.isFeatured) ||
        b.sortOrder - a.sortOrder ||
        b.updatedAt.localeCompare(a.updatedAt)
      );
    });
  }, [category, language, locale, platform, products, query, sort, sourceType, type]);

  const clearFilters = () => {
    setQuery("");
    setPlatform("all");
    setCategory("all");
    setSourceType("all");
    setType("all");
    setLanguage("all");
    setSort("featured");
  };

  const filterPanel = (
    <FilterPanel
      locale={locale}
      total={filtered.length}
      categories={categories}
      languages={languages}
      platform={platform}
      setPlatform={setPlatform}
      category={category}
      setCategory={setCategory}
      sourceType={sourceType}
      setSourceType={setSourceType}
      type={type}
      setType={setType}
      language={language}
      setLanguage={setLanguage}
      sort={sort}
      setSort={setSort}
      clearFilters={clearFilters}
    />
  );

  return (
    <main className="bg-[#f6f8fb]">
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <TrustIntro locale={locale} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className="hidden lg:block lg:sticky lg:top-24">{filterPanel}</aside>

        <div className="lg:hidden">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-slate-900">{locale === "zh" ? "筛选" : "Filters"}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {locale === "zh" ? `${filtered.length} 个结果` : `${filtered.length} results`}
                </div>
              </div>
              <Button
                variant="secondary"
                type="button"
                className="rounded-lg"
                onClick={() => setFiltersOpen((value) => !value)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
            {filtersOpen ? <div className="mt-4">{filterPanel}</div> : null}
          </div>
        </div>

        <div className="min-w-0 space-y-7">
          <section id="products">
            <SectionHeader
              title={t.allProducts}
              description={`${t.publishedOnly} ${t.productCount.replace("{count}", String(filtered.length))}`}
            />
            {filtered.length ? (
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {filtered.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    colorIndex={index}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text={t.noResults} />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function FilterPanel({
  locale,
  total,
  categories,
  languages,
  platform,
  setPlatform,
  category,
  setCategory,
  sourceType,
  setSourceType,
  type,
  setType,
  language,
  setLanguage,
  sort,
  setSort,
  clearFilters
}: {
  locale: Locale;
  total: number;
  categories: CategoryFilterView[];
  languages: Array<{ code: string; name: string }>;
  platform: string;
  setPlatform: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sourceType: "all" | ProductSourceType;
  setSourceType: (value: "all" | ProductSourceType) => void;
  type: string;
  setType: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  sort: SortMode;
  setSort: (value: SortMode) => void;
  clearFilters: () => void;
}) {
  const t = ui[locale];
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">{locale === "zh" ? "筛选" : "Filters"}</h2>
          <p className="mt-1 text-xs text-slate-500">
            {locale === "zh" ? `${total} 个结果` : `${total} results`}
          </p>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-blue-700 hover:text-blue-600"
        >
          {locale === "zh" ? "重置" : "Reset"}
        </button>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase text-slate-400">{t.sort}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="h-10 w-full rounded-lg border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="featured">{locale === "zh" ? "推荐优先" : "Featured first"}</option>
            <option value="updated">{locale === "zh" ? "最新更新" : "Latest updated"}</option>
            <option value="name">{locale === "zh" ? "名称排序" : "Name"}</option>
          </select>
        </label>
        <RadioGroup
          label={t.source}
          value={sourceType}
          onChange={(value) => setSourceType(value as "all" | ProductSourceType)}
          options={[
            ["all", t.all],
            ["self_built", t.selfBuilt],
            ["curated", t.curated]
          ]}
        />
        <RadioGroup
          label={t.category}
          value={category}
          onChange={setCategory}
          options={[
            ["all", t.all],
            ...categories.map((item) => [item.slug, item.name] as [string, string])
          ]}
        />
        <RadioGroup
          label={t.platform}
          value={platform}
          onChange={setPlatform}
          options={[
            ["all", t.all],
            ...platformOptions.map((item) => [item, formatPlatform(item)] as [string, string])
          ]}
        />
        <RadioGroup
          label={t.type}
          value={type}
          onChange={setType}
          options={[
            ["all", t.all],
            ...typeOptions.map((item) => [item, formatProductType(item, locale)] as [string, string])
          ]}
        />
        <RadioGroup
          label={t.language}
          value={language}
          onChange={setLanguage}
          options={[
            ["all", t.all],
            ...languages.map((item) => [item.code, item.name] as [string, string])
          ]}
        />
      </div>
    </div>
  );
}

function RadioGroup({
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
    <div>
      <div className="mb-2 text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className="grid gap-1">
        {options.map(([optionValue, text]) => {
          const active = value === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                active
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <span>{text}</span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
