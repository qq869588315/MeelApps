import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteDocumentPage, type SiteDocumentContent } from "@/components/front/site-document-page";
import type { Locale } from "@/lib/db/schema";
import { isLocale } from "@/lib/i18n";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/public-contact";
import { defaultSettings } from "@/lib/settings";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const privacyContent: Record<Locale, SiteDocumentContent> = {
  zh: {
    badge: "隐私政策",
    title: "MeelApps 隐私政策",
    description:
      "这份说明用于解释 MeelApps 在工具查询、下载跳转和反馈沟通中会如何处理信息。",
    sections: [
      {
        title: "我们会收集的信息",
        paragraphs: [
          "当你浏览站点时，MeelApps 会尽量减少信息收集。站点主要用于展示工具信息和提供官方下载入口。",
          "当你点击下载或获取按钮时，系统会记录基础下载统计，包括产品、平台、时间、来源页面、设备类型、检测到的系统、User-Agent，以及经过哈希处理后的 IP。我们不保存明文 IP。"
        ]
      },
      {
        title: "Cookie 与统计",
        paragraphs: [
          "普通访客不需要注册或登录。站点不会为了浏览工具信息而要求你提供账号、姓名或手机号。",
          "如果站点启用了 Umami 或类似统计脚本，它只用于了解页面访问情况和站点运行效果，不用于建立个人画像或跨站追踪。"
        ]
      },
      {
        title: "第三方链接",
        paragraphs: [
          "MeelApps 中的第三方工具入口会跳转到官网、GitHub Releases、官方商店或官方文档。第三方网站和软件由对应作者或公司负责。",
          "离开 MeelApps 后，第三方网站可能适用自己的隐私政策和服务条款。"
        ]
      },
      {
        title: "联系与处理",
        paragraphs: [
          `如果你希望反馈链接失效、信息错误、风险提示或其它隐私相关问题，可以通过 ${PUBLIC_CONTACT_EMAIL} 联系我。`,
          "我会在合理范围内复查并更新站点内容。"
        ]
      }
    ]
  },
  en: {
    badge: "Privacy Policy",
    title: "MeelApps Privacy Policy",
    description:
      "This page explains how MeelApps handles information during tool discovery, download redirects, and feedback.",
    sections: [
      {
        title: "Information We Collect",
        paragraphs: [
          "MeelApps keeps data collection minimal. The site is primarily used to display tool information and link to official download sources.",
          "When you click a download or get button, the system records basic download statistics, including product, platform, time, referrer, device type, detected OS, User-Agent, and a hashed IP. Plain IP addresses are not stored."
        ]
      },
      {
        title: "Cookies and Analytics",
        paragraphs: [
          "Regular visitors do not need to register or sign in. The site does not ask for an account, real name, or phone number just to browse tool information.",
          "If Umami or similar analytics is enabled, it is used to understand page visits and site operation, not to build personal profiles or track you across sites."
        ]
      },
      {
        title: "Third-party Links",
        paragraphs: [
          "Third-party tool entries on MeelApps link to official websites, GitHub Releases, official stores, or official documentation. Those tools and websites are operated by their authors or companies.",
          "After leaving MeelApps, third-party privacy policies and terms may apply."
        ]
      },
      {
        title: "Contact",
        paragraphs: [
          `For broken links, incorrect information, risk notices, or privacy-related questions, contact ${PUBLIC_CONTACT_EMAIL}.`,
          "I will review and update site content where reasonable."
        ]
      }
    ]
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "zh";
  const content = privacyContent[locale];
  return {
    title: `${content.title} | Meel Apps`,
    description: content.description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        zh: "/zh/privacy",
        en: "/en/privacy"
      }
    }
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  return (
    <SiteDocumentPage
      locale={locale}
      icpNumber={defaultSettings.icpNumber}
      content={privacyContent[locale]}
    />
  );
}
