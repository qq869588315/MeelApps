import type { Locale } from "@/lib/db/schema";

export const locales = ["zh", "en"] as const;
export const defaultLocale: Locale = "zh";

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === "en" ? "en" : "zh";
}

export function isLocale(value: string): value is Locale {
  return value === "zh" || value === "en";
}

export const ui = {
  zh: {
    products: "产品",
    docs: "文档",
    searchPlaceholder: "搜索产品名称、关键词或分类",
    searchButton: "搜索",
    platform: "平台",
    category: "分类",
    type: "类型",
    language: "支持语言",
    sort: "排序",
    all: "全部",
    featured: "推荐产品",
    allProducts: "全部产品",
    noResults: "没有找到匹配的产品。",
    detail: "查看详情",
    download: "下载",
    downloadArea: "下载",
    recommended: "推荐",
    screenshots: "截图",
    about: "关于此 App",
    whatsNew: "最新更新",
    history: "查看历史更新日志",
    support: "支持与信息",
    related: "相关推荐",
    version: "版本",
    updated: "更新时间",
    size: "文件大小",
    requirement: "系统要求",
    footerTagline: "Meel 的个人应用与工具集合。",
    privacy: "隐私政策",
    terms: "服务条款",
    contact: "联系方式",
    languageLabel: "中文",
    productCount: "共 {count} 个产品",
    publishedOnly: "置顶或推荐的应用会优先展示在这里。"
  },
  en: {
    products: "Products",
    docs: "Docs",
    searchPlaceholder: "Search apps, keywords, or categories",
    searchButton: "Search",
    platform: "Platform",
    category: "Category",
    type: "Type",
    language: "App language",
    sort: "Sort",
    all: "All",
    featured: "Featured Apps",
    allProducts: "All Apps",
    noResults: "No matching apps found.",
    detail: "Details",
    download: "Download",
    downloadArea: "Downloads",
    recommended: "Recommended",
    screenshots: "Screenshots",
    about: "About this app",
    whatsNew: "What's New",
    history: "View release history",
    support: "Support & Legal",
    related: "Related Apps",
    version: "Version",
    updated: "Updated",
    size: "Size",
    requirement: "Requirement",
    footerTagline: "Personal apps and tools by Meel.",
    privacy: "Privacy Policy",
    terms: "Terms",
    contact: "Contact",
    languageLabel: "English",
    productCount: "{count} apps",
    publishedOnly: "Pinned or featured apps are shown here first."
  }
} as const;

export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "zh" || segments[0] === "en") {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }
  return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
}

export function formatProductType(type: string, locale: Locale) {
  const zh: Record<string, string> = {
    desktop: "桌面端",
    mobile: "移动端",
    web_plugin: "Web 插件"
  };
  const en: Record<string, string> = {
    desktop: "Desktop",
    mobile: "Mobile",
    web_plugin: "Web Plugin"
  };
  return (locale === "zh" ? zh : en)[type] ?? type;
}

export function formatPlatform(platform: string) {
  const names: Record<string, string> = {
    windows: "Windows",
    macos: "macOS",
    ios: "iOS",
    android: "Android",
    web: "Web",
    browser_extension: "Browser Extension"
  };
  return names[platform] ?? platform;
}
