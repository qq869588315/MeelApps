"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CategoryRow = {
  id: number;
  slug: string;
  sortOrder: number;
  isEnabled: boolean;
  translations: {
    zh: { name: string } | null;
    en: { name: string } | null;
  };
};

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [rows, setRows] = useState(categories);
  const [message, setMessage] = useState("");

  function addRow() {
    setRows((current) => [
      ...current,
      {
        id: 0,
        slug: "new-category",
        sortOrder: current.length * 10,
        isEnabled: true,
        translations: { zh: { name: "新分类" }, en: { name: "New Category" } }
      }
    ]);
  }

  async function save(row: CategoryRow) {
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: row.id || undefined,
        slug: row.slug,
        sortOrder: row.sortOrder,
        isEnabled: row.isEnabled,
        zhName: row.translations.zh?.name ?? "",
        enName: row.translations.en?.name ?? ""
      })
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.ok) {
      setMessage(json?.error ?? "保存失败");
      return;
    }
    setMessage("已保存");
    location.reload();
  }

  function update(index: number, values: Partial<CategoryRow>) {
    setRows((current) => {
      const next = [...current];
      next[index] = { ...next[index], ...values };
      return next;
    });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">分类列表</h2>
        <Button type="button" onClick={addRow}>
          <Plus className="h-4 w-4" />
          新建分类
        </Button>
      </div>
      {message ? <div className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{message}</div> : null}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">中文名称</th>
              <th className="px-4 py-3 font-medium">英文名称</th>
              <th className="px-4 py-3 font-medium">排序</th>
              <th className="px-4 py-3 font-medium">启用</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, index) => (
              <tr key={`${row.id}-${index}`}>
                <td className="px-4 py-3">
                  <input className="h-10 w-full rounded-xl border-slate-200 text-sm" value={row.slug} onChange={(event) => update(index, { slug: event.target.value })} />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="h-10 w-full rounded-xl border-slate-200 text-sm"
                    value={row.translations.zh?.name ?? ""}
                    onChange={(event) =>
                      update(index, {
                        translations: {
                          ...row.translations,
                          zh: { name: event.target.value }
                        }
                      })
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="h-10 w-full rounded-xl border-slate-200 text-sm"
                    value={row.translations.en?.name ?? ""}
                    onChange={(event) =>
                      update(index, {
                        translations: {
                          ...row.translations,
                          en: { name: event.target.value }
                        }
                      })
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <input className="h-10 w-24 rounded-xl border-slate-200 text-sm" type="number" value={row.sortOrder} onChange={(event) => update(index, { sortOrder: Number(event.target.value) })} />
                </td>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={row.isEnabled} onChange={(event) => update(index, { isEnabled: event.target.checked })} />
                </td>
                <td className="px-4 py-3">
                  <Button type="button" variant="secondary" onClick={() => save(row)}>
                    保存
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
