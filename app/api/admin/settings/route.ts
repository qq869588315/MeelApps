import { requireAdminForApi } from "@/lib/auth";
import { withAdmin } from "@/lib/api";
import { getSiteSettings, saveSiteSettings } from "@/lib/settings";

export const runtime = "nodejs";

export async function GET() {
  return withAdmin(async () => {
    await requireAdminForApi();
    return getSiteSettings();
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    await requireAdminForApi();
    const values = (await request.json()) as Record<string, string>;
    await saveSiteSettings(values);
    return getSiteSettings();
  });
}
