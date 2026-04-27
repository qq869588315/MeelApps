import { AdminShell } from "@/components/admin/admin-shell";
import { PageTitle } from "@/components/admin/page-title";
import { Panel } from "@/components/ui/panel";
import { requireAdmin } from "@/lib/auth";
import { formatPlatform } from "@/lib/i18n";
import { getDashboardStats } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [admin, stats] = await Promise.all([requireAdmin(), getDashboardStats()]);
  return (
    <AdminShell active="/admin/dashboard" adminEmail={admin.email}>
      <PageTitle title="Dashboard" description="查看产品数量、发布状态和下载点击概览。" />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="产品总数" value={stats.products.total} />
        <StatCard label="已发布" value={stats.products.published} />
        <StatCard label="草稿" value={stats.products.draft} />
        <StatCard label="下载点击" value={stats.downloads} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="产品下载排行">
          <RankList items={stats.productRank.map((item) => [item.name, item.total])} />
        </Panel>
        <Panel title="平台下载排行">
          <RankList items={stats.platformRank.map((item) => [formatPlatform(item.platform), item.total])} />
        </Panel>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

function RankList({ items }: { items: Array<[string, number]> }) {
  if (!items.length) return <p className="text-sm text-slate-500">暂无数据</p>;
  return (
    <div className="space-y-3">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-700">{label}</span>
          <span className="font-semibold text-slate-950">{value}</span>
        </div>
      ))}
    </div>
  );
}
