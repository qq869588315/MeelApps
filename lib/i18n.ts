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
    products: "工具",
    docs: "文档",
    searchPlaceholder: "搜索工具名称、关键词或分类",
    searchButton: "搜索",
    platform: "平台",
    category: "分类",
    type: "类型",
    source: "工具来源",
    selfBuilt: "本站工具",
    curated: "精选工具",
    selfBuiltBadge: "本站出品",
    curatedBadge: "精选",
    selfBuiltProduct: "本站工具",
    curatedProduct: "精选第三方工具",
    language: "支持语言",
    sort: "排序",
    all: "全部",
    featured: "推荐工具",
    allProducts: "全部工具",
    noResults: "没有找到匹配的工具。",
    detail: "查看详情",
    download: "下载",
    getTool: "获取",
    officialDownload: "官方下载",
    siteDownload: "本站下载",
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
    footerTagline: "优质、可信、绿色的工具查询与官方下载入口。",
    privacy: "隐私政策",
    terms: "服务条款",
    contact: "联系方式",
    languageLabel: "中文",
    productCount: "共 {count} 个工具",
    publishedOnly: "人工验证过的工具会按推荐、更新时间等规则展示。",
    trustedNav: "可信工具导航",
    homeHeroTitle: "优质可信的工具下载导航",
    homeHeroDescription:
      "收录我开发、使用或验证过的实用工具，优先提供可信官方来源，不提供二次打包下载。",
    aboutSite: "关于此站点",
    aboutSiteTooltip: "查看 MeelApps 的收录原则、官方下载来源和反馈方式。",
    trustOfficialSource: "官方来源",
    trustCleanDownload: "绿色下载",
    trustManualVerify: "人工验证",
    trustFeedbackMaintained: "可反馈维护",
    verified: "已验证",
    cleanEntry: "绿色入口",
    officialExternal: "官方外链",
    aboutSiteTitle: "MeelApps 是什么",
    aboutSiteIntro:
      "MeelApps 是一个优质、可信、绿色的工具查询与官方下载导航。这里收录我个人开发、使用或验证过的工具，帮助大家避开广告下载站、二次打包和不可信来源。",
    aboutSitePrincipleTitle: "收录原则",
    aboutSitePrinciple:
      "本站优先提供官网、GitHub Releases、官方商店和官方文档链接。第三方工具不由本站托管安装包，本站只提供验证过的官方入口和使用建议。",
    aboutSiteFeedbackTitle: "欢迎反馈",
    aboutSiteFeedback:
      "如果你发现链接失效、下载地址变更、工具存在风险或信息描述有误，可以通过反馈入口告诉我，我会尽快复查和更新，如果有本站未收录的优秀工具也欢迎推荐给我，大家一起完善工具库。",
    thirdPartyNotice:
      "第三方工具归原作者或对应公司所有，本站仅提供已验证的官方入口和使用建议。",
    gotIt: "我知道了",
    feedbackIssue: "反馈问题",
    feedbackThisTool: "反馈此工具",
    siteFeedbackSubject: "MeelApps 站点反馈",
    toolFeedbackSubject: "MeelApps 工具反馈",
    feedbackMailBody:
      "请描述你发现的问题：\n- 链接打不开\n- 下载地址变更\n- 工具有风险\n- 信息描述有误\n- 推荐替代工具\n\n页面："
  },
  en: {
    products: "Tools",
    docs: "Docs",
    searchPlaceholder: "Search tools, keywords, or categories",
    searchButton: "Search",
    platform: "Platform",
    category: "Category",
    type: "Type",
    source: "Tool Source",
    selfBuilt: "Site Tools",
    curated: "Curated Tools",
    selfBuiltBadge: "Site Made",
    curatedBadge: "Curated",
    selfBuiltProduct: "Site Tool",
    curatedProduct: "Curated Third-party Tool",
    language: "App language",
    sort: "Sort",
    all: "All",
    featured: "Featured Tools",
    allProducts: "All Tools",
    noResults: "No matching tools found.",
    detail: "Details",
    download: "Download",
    getTool: "Get",
    officialDownload: "Official Download",
    siteDownload: "Site Download",
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
    footerTagline: "A clean, trusted directory for practical tools and official downloads.",
    privacy: "Privacy Policy",
    terms: "Terms",
    contact: "Contact",
    languageLabel: "English",
    productCount: "{count} tools",
    publishedOnly: "Manually verified tools are ordered by recommendation, update time, and other rules.",
    trustedNav: "Trusted Tool Directory",
    homeHeroTitle: "A trusted directory for tool downloads",
    homeHeroDescription:
      "A curated collection of tools I built, used, or verified, prioritizing trusted official sources instead of repackaged downloads.",
    aboutSite: "About This Site",
    aboutSiteTooltip: "See how MeelApps selects tools, links to official sources, and accepts feedback.",
    trustOfficialSource: "Official Sources",
    trustCleanDownload: "Clean Downloads",
    trustManualVerify: "Manually Verified",
    trustFeedbackMaintained: "Feedback Maintained",
    verified: "Verified",
    cleanEntry: "Clean Entry",
    officialExternal: "Official Link",
    aboutSiteTitle: "What MeelApps Is",
    aboutSiteIntro:
      "MeelApps is a quality, trusted, clean directory for tool discovery and official downloads. It lists tools I built, used, or verified, helping users avoid ad-heavy download sites, repackaged installers, and untrusted sources.",
    aboutSitePrincipleTitle: "Curation Principles",
    aboutSitePrinciple:
      "This site prioritizes official websites, GitHub Releases, official stores, and official documentation. Third-party installers are not hosted here; MeelApps provides verified official entry points and usage notes.",
    aboutSiteFeedbackTitle: "Feedback Welcome",
    aboutSiteFeedback:
      "If a link breaks, a download address changes, a tool becomes risky, or any description is inaccurate, use the feedback entry and I will review it as soon as possible. Recommendations for excellent tools not yet listed here are also welcome so we can improve the directory together.",
    thirdPartyNotice:
      "Third-party tools belong to their authors or companies. This site only provides verified official entry points and usage suggestions.",
    gotIt: "Got it",
    feedbackIssue: "Report Issue",
    feedbackThisTool: "Report This Tool",
    siteFeedbackSubject: "MeelApps Site Feedback",
    toolFeedbackSubject: "MeelApps Tool Feedback",
    feedbackMailBody:
      "Please describe the issue:\n- Link does not open\n- Download address changed\n- Tool may be risky\n- Description is inaccurate\n- Recommend an alternative tool\n\nPage: "
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
