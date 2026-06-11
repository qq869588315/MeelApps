import type { Locale } from "@/lib/db/schema";
import { ui } from "@/lib/i18n";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/public-contact";

export function buildFeedbackHref({
  locale,
  contactEmail,
  subject,
  pageUrl
}: {
  locale: Locale;
  contactEmail?: string;
  subject: string;
  pageUrl?: string;
}) {
  const body = `${ui[locale].feedbackMailBody}${pageUrl ?? ""}`;
  const recipient = contactEmail?.trim() || PUBLIC_CONTACT_EMAIL;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
