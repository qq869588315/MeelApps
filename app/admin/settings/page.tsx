import { AdminShell } from "@/components/admin/admin-shell";
import { PageTitle } from "@/components/admin/page-title";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [admin, settings] = await Promise.all([requireAdmin(), getSiteSettings()]);
  return (
    <AdminShell active="/admin/settings" adminEmail={admin.email}>
      <PageTitle title="系统设置" description="维护站点基础信息、搜索优化、统计和当前存储配置。" />
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
