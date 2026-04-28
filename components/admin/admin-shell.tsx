import {
  BarChart3,
  FileText,
  FolderTree,
  LayoutDashboard,
  Package,
  Settings
} from "lucide-react";
import { LogoutButton } from "./logout-button";

const navItems = [
  { href: "/admin/dashboard", label: "数据概览", icon: LayoutDashboard },
  { href: "/admin/products", label: "产品管理", icon: Package },
  { href: "/admin/drafts", label: "草稿箱", icon: FileText },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree },
  { href: "/admin/stats", label: "数据统计", icon: BarChart3 },
  { href: "/admin/settings", label: "系统设置", icon: Settings }
];

export function AdminShell({
  active,
  adminEmail,
  children
}: {
  active: string;
  adminEmail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
              M
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">Meel Apps 后台</div>
              <div className="text-xs text-slate-500">apps.aameel.top</div>
            </div>
          </a>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="hidden sm:inline">{adminEmail}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const current = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${current ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
