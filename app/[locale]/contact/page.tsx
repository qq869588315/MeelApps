import type { Metadata } from "next";
import { ArrowLeft, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactActions } from "@/components/front/contact-actions";
import { Footer } from "@/components/front/footer";
import { Header } from "@/components/front/header";
import { buttonClass } from "@/components/ui/button";
import type { Locale } from "@/lib/db/schema";
import { buildFeedbackHref } from "@/lib/feedback";
import { isLocale, ui } from "@/lib/i18n";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/public-contact";
import { defaultSettings } from "@/lib/settings";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const contactCopy = {
  zh: {
    title: "联系方式",
    description:
      "如果你发现链接失效、下载地址变更、工具存在风险、信息描述有误，或想推荐优秀工具，可以通过这里联系我。",
    badge: "联系与反馈",
    emailLabel: "公开反馈邮箱",
    openEmail: "打开邮件客户端",
    copyEmail: "复制邮箱",
    copied: "已复制",
    copyFailed: "复制失败",
    feedbackTitle: "适合反馈的内容",
    feedbackItems: [
      "链接打不开或官方入口发生变化",
      "下载地址、版本、文件大小或系统要求不准确",
      "工具存在安全风险、捆绑安装或来源问题",
      "推荐本站还没有收录的优质工具"
    ],
    responseTitle: "处理方式",
    responseText:
      "我会优先复查官方下载入口、工具风险和明显的信息错误。第三方工具仍以官方页面和原作者说明为准。"
  },
  en: {
    title: "Contact",
    description:
      "Use this page to report broken links, changed download addresses, tool risks, inaccurate descriptions, or to recommend useful tools.",
    badge: "Contact and Feedback",
    emailLabel: "Public feedback email",
    openEmail: "Open Email Client",
    copyEmail: "Copy Email",
    copied: "Copied",
    copyFailed: "Copy Failed",
    feedbackTitle: "What to Report",
    feedbackItems: [
      "A link does not open or an official entry changed",
      "Download address, version, file size, or system requirement is inaccurate",
      "A tool has security, bundled installer, or source concerns",
      "A high-quality tool is missing from MeelApps"
    ],
    responseTitle: "How I Handle It",
    responseText:
      "I prioritize official download entries, tool risk issues, and clear information mistakes. Third-party tools are still governed by their official pages and authors."
  }
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "zh";
  const copy = contactCopy[locale];
  return {
    title: `${copy.title} | Meel Apps`,
    description: copy.description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        zh: "/zh/contact",
        en: "/en/contact"
      }
    }
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const copy = contactCopy[locale];
  const t = ui[locale];
  const mailHref = buildFeedbackHref({
    locale,
    subject: t.siteFeedbackSubject,
    pageUrl: `/${locale}/contact`
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header locale={locale} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-5">
          <a
            href={`/${locale}`}
            className={buttonClass("secondary", "min-h-11 shadow-sm")}
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "zh" ? "返回 Meel Apps" : "Back to Meel Apps"}
          </a>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1.18fr)] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase text-blue-700">{copy.badge}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {copy.description}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-950">{copy.emailLabel}</div>
                  <a
                    href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
                    className="mt-1 block break-all text-sm font-medium text-blue-700 hover:text-blue-600"
                  >
                    {PUBLIC_CONTACT_EMAIL}
                  </a>
                </div>
              </div>
              <ContactActions
                email={PUBLIC_CONTACT_EMAIL}
                mailHref={mailHref}
                labels={{
                  openEmail: copy.openEmail,
                  copyEmail: copy.copyEmail,
                  copied: copy.copied,
                  copyFailed: copy.copyFailed
                }}
              />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-950">
              <MessageSquareText className="h-5 w-5 text-blue-700" />
              <h2 className="font-semibold">{copy.feedbackTitle}</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {copy.feedbackItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5 text-blue-950 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-semibold">{copy.responseTitle}</h2>
            </div>
            <p className="mt-3 text-sm leading-6">{copy.responseText}</p>
          </section>
        </div>
      </main>
      <Footer locale={locale} icpNumber={defaultSettings.icpNumber} />
    </div>
  );
}
