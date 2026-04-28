import { AdminShell } from "@/components/admin/admin-shell";
import { PageTitle } from "@/components/admin/page-title";
import { Panel } from "@/components/ui/panel";
import { requireAdmin } from "@/lib/auth";
import { formatPlatform } from "@/lib/i18n";
import { getDashboardStats } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const [admin, stats] = await Promise.all([requireAdmin(), getDashboardStats()]);
  return (
    <AdminShell active="/admin/stats" adminEmail={admin.email}>
      <PageTitle title="数据统计" description="第一版以下载点击统计为主。" />
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="总点击" value={stats.downloads} />
        <Metric label="产品数" value={stats.products.total} />
        <Metric label="平台数" value={stats.platformRank.length} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="下载排行">
          <div className="space-y-3">
            {stats.productRank.map((row) => (
              <div key={row.productId} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <span>{row.name}</span>
                <strong>{row.total}</strong>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="平台排行">
          <div className="space-y-3">
            {stats.platformRank.map((row) => (
              <div key={row.platform} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <span>{formatPlatform(row.platform)}</span>
                <strong>{row.total}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="最近点击记录" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-3 py-2">时间</th>
                <th className="px-3 py-2">产品</th>
                <th className="px-3 py-2">平台</th>
                <th className="px-3 py-2">类型</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recent.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 text-slate-500">{row.createdAt.toLocaleString("zh-CN")}</td>
                  <td className="px-3 py-2">{row.productName}</td>
                  <td className="px-3 py-2">{formatPlatform(row.platform)}</td>
                  <td className="px-3 py-2">{row.downloadType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>
    </div>
  );
}
