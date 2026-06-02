import { db, sql } from "@/lib/db/client";
import {
  admins,
  adminSessions,
  categories,
  categoryTranslations,
  changelogs,
  downloadEvents,
  productDocuments,
  productLanguages,
  productMedia,
  productPlatforms,
  productTranslations,
  products,
  siteSettings
} from "@/lib/db/schema";
import { saveCategory, saveProductAggregate } from "@/lib/product-data";
import { hashPassword } from "@/lib/password";

async function reset() {
  await db.delete(downloadEvents);
  await db.delete(changelogs);
  await db.delete(productDocuments);
  await db.delete(productMedia);
  await db.delete(productPlatforms);
  await db.delete(productLanguages);
  await db.delete(productTranslations);
  await db.delete(products);
  await db.delete(categoryTranslations);
  await db.delete(categories);
  await db.delete(siteSettings);
  await db.delete(adminSessions);
  await db.delete(admins);
}

async function seedSettings() {
  await db.insert(siteSettings).values([
    { key: "siteName", value: "Meel Apps" },
    { key: "defaultLocale", value: "zh" },
    { key: "icpNumber", value: "新ICP备2026002990号-1" },
    { key: "contactEmail", value: "hello@example.com" },
    { key: "homeSeoTitleZh", value: "Meel Apps" },
    { key: "homeSeoDescriptionZh", value: "探索 Meel 打造的桌面工具、移动 App 和未来的插件产品。" },
    { key: "homeSeoTitleEn", value: "Meel Apps" },
    { key: "homeSeoDescriptionEn", value: "Explore apps and tools built by Meel." },
    { key: "umamiWebsiteId", value: "" },
    { key: "umamiScriptUrl", value: "" }
  ]);
}

async function main() {
  await reset();
  await seedSettings();

  const tools = await saveCategory({
    slug: "tools",
    sortOrder: 10,
    isEnabled: true,
    zhName: "工具类",
    enName: "Tools"
  });
  const productivity = await saveCategory({
    slug: "productivity",
    sortOrder: 20,
    isEnabled: true,
    zhName: "效率类",
    enName: "Productivity"
  });
  const security = await saveCategory({
    slug: "security",
    sortOrder: 30,
    isEnabled: true,
    zhName: "安全类",
    enName: "Security"
  });

  await saveProductAggregate({
    slug: "focus-box",
    status: "published",
    isFeatured: true,
    isPinned: true,
    sortOrder: 100,
    categoryId: productivity.id,
    productType: "desktop",
    sourceType: "self_built",
    iconUrl: "/demo/focus-box-icon.svg",
    translations: {
      zh: {
        name: "Focus Box",
        shortDescription: "一个帮助你快速整理任务、保持专注的桌面效率工具。",
        fullDescription: "Focus Box 面向需要稳定处理多项任务的桌面用户。它把任务收集、短时专注和快速归档放在一个轻量窗口里，适合工作日常使用。",
        featureHighlights: ["快速收集临时任务", "按项目整理待办", "专注计时和提醒", "支持 Windows 与 macOS"],
        seoTitle: "Focus Box",
        seoDescription: "Focus Box 是 Meel 打造的桌面效率工具。"
      },
      en: {
        name: "Focus Box",
        shortDescription: "A desktop productivity tool for organizing tasks and staying focused.",
        fullDescription: "Focus Box helps desktop users collect tasks, stay focused, and keep lightweight project notes in one calm workspace.",
        featureHighlights: ["Quick task capture", "Project-based organization", "Focus timer and reminders", "Windows and macOS support"],
        seoTitle: "Focus Box",
        seoDescription: "Focus Box is a desktop productivity tool by Meel."
      }
    },
    languages: [
      { languageCode: "zh-CN", languageNameZh: "中文", languageNameEn: "Chinese", sortOrder: 0 },
      { languageCode: "en-US", languageNameZh: "英文", languageNameEn: "English", sortOrder: 10 }
    ],
    platforms: [
      {
        platform: "windows",
        isEnabled: true,
        version: "1.2.0",
        releaseDate: "2026-04-20",
        fileSize: "48 MB",
        minSystemRequirement: "Windows 10+",
        downloadType: "direct",
        downloadUrl: "/demo/focus-box-windows.zip",
        storeName: "Direct Download",
        badgeType: "direct_download",
        checksum: "",
        sortOrder: 10
      },
      {
        platform: "macos",
        isEnabled: true,
        version: "1.2.0",
        releaseDate: "2026-04-20",
        fileSize: "52 MB",
        minSystemRequirement: "macOS 12+",
        downloadType: "direct",
        downloadUrl: "/demo/focus-box-macos.zip",
        storeName: "Direct Download",
        badgeType: "direct_download",
        checksum: "",
        sortOrder: 20
      }
    ],
    media: [
      { type: "icon", url: "/demo/focus-box-icon.svg", altText: "Focus Box icon", locale: null, platform: null, sortOrder: 0 },
      { type: "screenshot", url: "/demo/focus-box-windows.svg", altText: "Focus Box Windows screenshot", locale: null, platform: "windows", sortOrder: 10 },
      { type: "screenshot", url: "/demo/focus-box-macos.svg", altText: "Focus Box macOS screenshot", locale: null, platform: "macos", sortOrder: 20 }
    ],
    documents: documentSet("Focus Box"),
    changelogs: changelogSet()
  });

  await saveProductAggregate({
    slug: "clip-pocket",
    status: "published",
    isFeatured: true,
    isPinned: false,
    sortOrder: 80,
    categoryId: tools.id,
    productType: "mobile",
    sourceType: "curated",
    iconUrl: "/demo/clip-pocket-icon.svg",
    translations: {
      zh: {
        name: "Clip Pocket",
        shortDescription: "随手保存文本、链接和图片，跨设备快速整理灵感。",
        fullDescription: "Clip Pocket 用于移动端快速保存碎片信息。你可以收集链接、图片和短文本，再在空闲时统一整理。",
        featureHighlights: ["快速保存剪贴内容", "移动端轻量整理", "支持 iOS 与 Android"],
        seoTitle: "Clip Pocket",
        seoDescription: "Clip Pocket 是轻量移动收集工具。"
      },
      en: {
        name: "Clip Pocket",
        shortDescription: "Save text, links, and images quickly on mobile.",
        fullDescription: "Clip Pocket is a lightweight mobile collector for links, notes, and small pieces of inspiration.",
        featureHighlights: ["Quick mobile capture", "Organize clips later", "iOS and Android support"],
        seoTitle: "Clip Pocket",
        seoDescription: "Clip Pocket is a lightweight mobile capture app."
      }
    },
    languages: [{ languageCode: "zh-CN", languageNameZh: "中文", languageNameEn: "Chinese", sortOrder: 0 }],
    platforms: [
      {
        platform: "ios",
        isEnabled: true,
        version: "1.1.4",
        releaseDate: "2026-04-15",
        fileSize: "35 MB",
        minSystemRequirement: "iOS 15+",
        downloadType: "external",
        downloadUrl: "https://apps.apple.com/",
        storeName: "App Store",
        badgeType: "app_store",
        checksum: "",
        sortOrder: 10
      },
      {
        platform: "android",
        isEnabled: true,
        version: "1.1.4",
        releaseDate: "2026-04-15",
        fileSize: "39 MB",
        minSystemRequirement: "Android 10+",
        downloadType: "external",
        downloadUrl: "https://play.google.com/store",
        storeName: "Google Play",
        badgeType: "google_play",
        checksum: "",
        sortOrder: 20
      }
    ],
    media: [
      { type: "icon", url: "/demo/clip-pocket-icon.svg", altText: "Clip Pocket icon", locale: null, platform: null, sortOrder: 0 },
      { type: "screenshot", url: "/demo/clip-pocket-ios.svg", altText: "Clip Pocket iOS screenshot", locale: null, platform: "ios", sortOrder: 10 },
      { type: "screenshot", url: "/demo/clip-pocket-android.svg", altText: "Clip Pocket Android screenshot", locale: null, platform: "android", sortOrder: 20 }
    ],
    documents: documentSet("Clip Pocket"),
    changelogs: changelogSet("1.1.4", "2026-04-15")
  });

  await saveProductAggregate({
    slug: "safe-note",
    status: "draft",
    isFeatured: false,
    isPinned: false,
    sortOrder: 60,
    categoryId: security.id,
    productType: "mobile",
    sourceType: "curated",
    iconUrl: "/demo/safe-note-icon.svg",
    translations: {
      zh: {
        name: "Safe Note",
        shortDescription: "轻量私密笔记应用，适合保存重要信息和临时内容。",
        fullDescription: "Safe Note 是仍在准备中的私密笔记应用。",
        featureHighlights: ["轻量记录", "私密内容", "移动端优先"],
        seoTitle: "Safe Note",
        seoDescription: "Safe Note 私密笔记应用。"
      },
      en: {
        name: "Safe Note",
        shortDescription: "A lightweight private notes app for important information.",
        fullDescription: "Safe Note is a private notes app in draft.",
        featureHighlights: ["Lightweight notes", "Private content", "Mobile first"],
        seoTitle: "Safe Note",
        seoDescription: "Safe Note private notes app."
      }
    },
    languages: [
      { languageCode: "zh-CN", languageNameZh: "中文", languageNameEn: "Chinese", sortOrder: 0 },
      { languageCode: "en-US", languageNameZh: "英文", languageNameEn: "English", sortOrder: 10 },
      { languageCode: "ja-JP", languageNameZh: "日文", languageNameEn: "Japanese", sortOrder: 20 }
    ],
    platforms: [
      {
        platform: "ios",
        isEnabled: true,
        version: "0.9.0",
        releaseDate: "2026-04-10",
        fileSize: "28 MB",
        minSystemRequirement: "iOS 15+",
        downloadType: "external",
        downloadUrl: "https://apps.apple.com/",
        storeName: "App Store",
        badgeType: "app_store",
        checksum: "",
        sortOrder: 10
      }
    ],
    media: [{ type: "icon", url: "/demo/safe-note-icon.svg", altText: "Safe Note icon", locale: null, platform: null, sortOrder: 0 }],
    documents: documentSet("Safe Note"),
    changelogs: changelogSet("0.9.0", "2026-04-10")
  });

  await saveProductAggregate({
    slug: "clean-desk",
    status: "hidden",
    isFeatured: false,
    isPinned: false,
    sortOrder: 40,
    categoryId: tools.id,
    productType: "desktop",
    sourceType: "self_built",
    iconUrl: "/demo/clean-desk-icon.svg",
    translations: {
      zh: {
        name: "Clean Desk",
        shortDescription: "快速清理桌面文件，按规则归档常用资料。",
        fullDescription: "Clean Desk 用于快速整理桌面文件，目前处于隐藏状态。",
        featureHighlights: ["桌面文件归档", "规则整理", "Windows 支持"],
        seoTitle: "Clean Desk",
        seoDescription: "Clean Desk 桌面整理工具。"
      },
      en: {
        name: "Clean Desk",
        shortDescription: "Clean desktop files and archive common materials by rules.",
        fullDescription: "Clean Desk helps archive desktop files and is hidden in this seed.",
        featureHighlights: ["Desktop cleanup", "Rule-based archive", "Windows support"],
        seoTitle: "Clean Desk",
        seoDescription: "Clean Desk desktop organizer."
      }
    },
    languages: [{ languageCode: "zh-CN", languageNameZh: "中文", languageNameEn: "Chinese", sortOrder: 0 }],
    platforms: [
      {
        platform: "windows",
        isEnabled: true,
        version: "0.8.2",
        releaseDate: "2026-04-01",
        fileSize: "31 MB",
        minSystemRequirement: "Windows 10+",
        downloadType: "direct",
        downloadUrl: "/demo/clean-desk-windows.zip",
        storeName: "Direct Download",
        badgeType: "direct_download",
        checksum: "",
        sortOrder: 10
      }
    ],
    media: [{ type: "icon", url: "/demo/clean-desk-icon.svg", altText: "Clean Desk icon", locale: null, platform: null, sortOrder: 0 }],
    documents: documentSet("Clean Desk"),
    changelogs: changelogSet("0.8.2", "2026-04-01")
  });

  await saveProductAggregate({
    slug: "tiny-timer",
    status: "published",
    isFeatured: false,
    isPinned: false,
    sortOrder: 20,
    categoryId: productivity.id,
    productType: "desktop",
    sourceType: "self_built",
    iconUrl: "/demo/tiny-timer-icon.svg",
    translations: {
      zh: {
        name: "Tiny Timer",
        shortDescription: "一个极简计时器，适合番茄钟、会议提醒和短任务。",
        fullDescription: "Tiny Timer 是用于短任务和会议提醒的极简桌面计时器。",
        featureHighlights: ["极简计时", "会议提醒", "Windows 与 macOS"],
        seoTitle: "Tiny Timer",
        seoDescription: "Tiny Timer 极简桌面计时器。"
      },
      en: {
        name: "Tiny Timer",
        shortDescription: "A minimal timer for focus sessions, meetings, and short tasks.",
        fullDescription: "Tiny Timer keeps short focus sessions and meeting reminders lightweight.",
        featureHighlights: ["Minimal timer", "Meeting reminders", "Windows and macOS"],
        seoTitle: "Tiny Timer",
        seoDescription: "Tiny Timer is a minimal desktop timer."
      }
    },
    languages: [
      { languageCode: "zh-CN", languageNameZh: "中文", languageNameEn: "Chinese", sortOrder: 0 },
      { languageCode: "en-US", languageNameZh: "英文", languageNameEn: "English", sortOrder: 10 }
    ],
    platforms: [
      {
        platform: "macos",
        isEnabled: true,
        version: "1.0.1",
        releaseDate: "2026-04-18",
        fileSize: "18 MB",
        minSystemRequirement: "macOS 12+",
        downloadType: "direct",
        downloadUrl: "/demo/tiny-timer-macos.zip",
        storeName: "Direct Download",
        badgeType: "direct_download",
        checksum: "",
        sortOrder: 10
      },
      {
        platform: "windows",
        isEnabled: true,
        version: "1.0.1",
        releaseDate: "2026-04-18",
        fileSize: "16 MB",
        minSystemRequirement: "Windows 10+",
        downloadType: "direct",
        downloadUrl: "/demo/tiny-timer-windows.zip",
        storeName: "Direct Download",
        badgeType: "direct_download",
        checksum: "",
        sortOrder: 20
      }
    ],
    media: [
      { type: "icon", url: "/demo/tiny-timer-icon.svg", altText: "Tiny Timer icon", locale: null, platform: null, sortOrder: 0 },
      { type: "screenshot", url: "/demo/tiny-timer-macos.svg", altText: "Tiny Timer screenshot", locale: null, platform: "macos", sortOrder: 10 }
    ],
    documents: documentSet("Tiny Timer"),
    changelogs: changelogSet("1.0.1", "2026-04-18")
  });

  await db.insert(admins).values({
    email: process.env.ADMIN_EMAIL ?? "admin@example.com",
    passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || "change_me_admin_password")
  });

  console.log("Seed complete. Admin: admin@example.com / change_me_admin_password unless ADMIN_PASSWORD is set.");
  await sql.end();
}

function documentSet(productName: string) {
  return [
    {
      type: "help" as const,
      locale: "zh" as const,
      contentType: "markdown" as const,
      content: `# ${productName} 帮助\n\n这里是 ${productName} 的基础帮助文档。`,
      externalUrl: ""
    },
    {
      type: "help" as const,
      locale: "en" as const,
      contentType: "markdown" as const,
      content: `# ${productName} Help\n\nThis is the basic help page for ${productName}.`,
      externalUrl: ""
    },
    {
      type: "privacy" as const,
      locale: "zh" as const,
      contentType: "markdown" as const,
      content: `# 隐私政策\n\n${productName} 第一版示例隐私政策。`,
      externalUrl: ""
    },
    {
      type: "privacy" as const,
      locale: "en" as const,
      contentType: "markdown" as const,
      content: `# Privacy Policy\n\nSample privacy policy for ${productName}.`,
      externalUrl: ""
    },
    {
      type: "terms" as const,
      locale: "zh" as const,
      contentType: "markdown" as const,
      content: `# 服务条款\n\n${productName} 第一版示例服务条款。`,
      externalUrl: ""
    },
    {
      type: "terms" as const,
      locale: "en" as const,
      contentType: "markdown" as const,
      content: `# Terms\n\nSample terms for ${productName}.`,
      externalUrl: ""
    }
  ];
}

function changelogSet(version = "1.2.0", releaseDate = "2026-04-20") {
  return [
    {
      version,
      releaseDate,
      locale: "zh" as const,
      content: "- 优化首次启动速度\n- 修复部分界面显示问题",
      isLatest: true,
      sortOrder: 10
    },
    {
      version,
      releaseDate,
      locale: "en" as const,
      content: "- Improved startup speed\n- Fixed several interface issues",
      isLatest: true,
      sortOrder: 10
    },
    {
      version: "1.0.0",
      releaseDate: "2026-02-01",
      locale: "zh" as const,
      content: "- 首个公开版本发布",
      isLatest: false,
      sortOrder: 20
    },
    {
      version: "1.0.0",
      releaseDate: "2026-02-01",
      locale: "en" as const,
      content: "- First public release",
      isLatest: false,
      sortOrder: 20
    }
  ];
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 });
  process.exit(1);
});
