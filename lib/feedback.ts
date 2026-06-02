import type { Locale } from "@/lib/db/schema";
import { ui } from "@/lib/i18n";

export function buildFeedbackHref({
  locale,
  contactEmail,
  subject,
  pageUrl
}: {
  locale: Locale;
  contactEmail: string;
  subject: string;
  pageUrl?: string;
}) {
  const body = `${ui[locale].feedbackMailBody}${pageUrl ?? ""}`;
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
