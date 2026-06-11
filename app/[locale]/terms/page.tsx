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

const termsContent: Record<Locale, SiteDocumentContent> = {
  zh: {
    badge: "服务条款",
    title: "MeelApps 服务条款",
    description:
      "使用 MeelApps 即表示你理解本站是工具导航和官方下载入口，第三方工具由其作者或公司负责。",
    sections: [
      {
        title: "站点定位",
        paragraphs: [
          "MeelApps 是一个优质、可信、绿色的工具查询与官方下载导航。本站收录我开发、使用或验证过的工具。",
          "本站会优先提供官网、GitHub Releases、官方商店和官方文档链接，帮助用户避开广告下载站、二次打包和不可可信来源。"
        ]
      },
      {
        title: "第三方工具",
        paragraphs: [
          "第三方工具的名称、商标、软件、文档和服务归原作者或对应公司所有。",
          "本站不托管第三方工具安装包，只提供验证过的官方入口、基础信息和使用建议。下载或使用前，请自行确认官方页面、版本、许可协议和系统要求。"
        ]
      },
      {
        title: "信息准确性",
        paragraphs: [
          "我会尽量维护工具信息、版本、下载入口和风险提示的准确性，但外部页面和软件状态可能随时变化。",
          "如果你发现链接失效、下载地址变更、描述错误或工具存在风险，请通过反馈入口告诉我。"
        ]
      },
      {
        title: "联系",
        paragraphs: [
          `如需反馈问题、推荐工具或提出服务条款相关问题，可以联系 ${PUBLIC_CONTACT_EMAIL}。`,
          "我会根据实际情况复查并更新站点内容。"
        ]
      }
    ]
  },
  en: {
    badge: "Terms",
    title: "MeelApps Terms",
    description:
      "By using MeelApps, you understand that this site is a tool directory and official download entry point.",
    sections: [
      {
        title: "Site Purpose",
        paragraphs: [
          "MeelApps is a clean, trusted directory for tool discovery and official downloads. It lists tools I built, used, or verified.",
          "The site prioritizes official websites, GitHub Releases, official stores, and official documentation to help users avoid ad-heavy download sites, repackaged installers, and untrusted sources."
        ]
      },
      {
        title: "Third-party Tools",
        paragraphs: [
          "Third-party tool names, trademarks, software, documentation, and services belong to their authors or companies.",
          "MeelApps does not host third-party installers. It provides verified official entry points, basic information, and usage notes. Before downloading or using a tool, check the official page, version, license, and system requirements yourself."
        ]
      },
      {
        title: "Information Accuracy",
        paragraphs: [
          "I try to keep tool information, versions, download links, and risk notes accurate, but external pages and software status may change at any time.",
          "If a link breaks, a download address changes, a description is inaccurate, or a tool becomes risky, please report it through the feedback entry."
        ]
      },
      {
        title: "Contact",
        paragraphs: [
          `For issue reports, tool recommendations, or questions about these terms, contact ${PUBLIC_CONTACT_EMAIL}.`,
          "I will review and update the site where appropriate."
        ]
      }
    ]
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "zh";
  const content = termsContent[locale];
  return {
    title: `${content.title} | Meel Apps`,
    description: content.description,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        zh: "/zh/terms",
        en: "/en/terms"
      }
    }
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  return (
    <SiteDocumentPage
      locale={locale}
      icpNumber={defaultSettings.icpNumber}
      content={termsContent[locale]}
    />
  );
}
