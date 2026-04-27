"use client";

import { Download, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonClass, Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/app-icon";
import { formatPlatform } from "@/lib/i18n";
import type { ProductStatus } from "@/lib/db/schema";

export type AdminProductRow = {
  id: number;
  slug: string;
  status: ProductStatus;
  name: string;
  categoryName: string | null;
  iconUrl: string | null;
  platforms: string[];
  downloadCount: number;
};

export function ProductTable({
  products,
  showCreate = true
}: {
  products: AdminProductRow[];
  showCreate?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const rows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((product) => {
      if (status !== "all" && product.status !== status) return false;
      if (!keyword) return true;
      return `${product.name} ${product.slug} ${product.categoryName ?? ""}`.toLowerCase().includes(keyword);
    });
  }, [products, query, status]);

  async function action(id: number, nextAction: "publish" | "hide" | "restore") {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: nextAction })
    });
    location.reload();
  }

  async function remove(id: number) {
    const ok = confirm("确认删除该产品？删除后该产品将不再显示在后台默认列表中，此操作不可轻易恢复。");
    if (!ok) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      alert(body?.error ?? "删除失败");
      return;
    }
    location.reload();
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 md:w-80">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full border-0 bg-transparent text-sm outline-none focus:ring-0"
            placeholder="搜索产品"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-xl border-slate-200 text-sm"
          >
            <option value="all">状态：全部</option>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="hidden">隐藏</option>
          </select>
          {showCreate ? (
            <a href="/admin/products/new" className={buttonClass("primary")}>
              <Plus className="h-4 w-4" />
              新建产品
            </a>
          ) : null}
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">产品</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">分类</th>
              <th className="px-4 py-3 font-medium">平台</th>
              <th className="px-4 py-3 font-medium">下载量</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AppIcon name={product.name} iconUrl={product.iconUrl} size="sm" />
                    <div>
                      <div className="font-medium text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-500">/{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{product.categoryName ?? "-"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {product.platforms.map(formatPlatform).join(" / ") || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Download className="h-4 w-4 text-slate-400" />
                    {product.downloadCount}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <a href={`/admin/products/${product.id}/edit`} className={buttonClass("secondary", "min-h-8 px-3 py-1 text-xs")}>
                      编辑
                    </a>
                    {product.status === "published" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="min-h-8 px-3 py-1 text-xs text-orange-700"
                        onClick={() => action(product.id, "hide")}
                      >
                        隐藏
                      </Button>
                    ) : null}
                    {product.status === "hidden" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="min-h-8 px-3 py-1 text-xs text-green-700"
                        onClick={() => action(product.id, "restore")}
                      >
                        恢复发布
                      </Button>
                    ) : null}
                    {product.status === "draft" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="min-h-8 px-3 py-1 text-xs text-green-700"
                        onClick={() => action(product.id, "publish")}
                      >
                        发布
                      </Button>
                    ) : null}
                    {product.status !== "published" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="min-h-8 px-3 py-1 text-xs text-red-700"
                        onClick={() => remove(product.id)}
                      >
                        删除
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === "published") return <Badge tone="green">已发布</Badge>;
  if (status === "hidden") return <Badge tone="orange">隐藏</Badge>;
  if (status === "deleted") return <Badge tone="red">已删除</Badge>;
  return <Badge>草稿</Badge>;
}
