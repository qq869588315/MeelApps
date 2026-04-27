import { redirect } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n";

export default function IndexPage() {
  redirect(`/${normalizeLocale(process.env.DEFAULT_LOCALE)}`);
}
