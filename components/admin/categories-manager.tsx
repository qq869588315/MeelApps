"use client";

import { Plus, Trash2 } from "lucide-react";
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

type Notice = {
  type: "success" | "error";
  text: string;
};

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [rows, setRows] = useState(categories);
  const [notice, setNotice] = useState<Notice | null>(null);

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
    setNotice(null);
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
      setNotice({ type: "error", text: json?.error ?? "保存失败" });
      return;
    }
    setNotice({ type: "success", text: "分类已保存" });
    location.reload();
  }

  async function remove(row: CategoryRow, index: number) {
    if (!row.id) {
      setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
      return;
    }

    const name = row.translations.zh?.name || row.slug;
    const ok = window.confirm(`确认删除分类「${name}」？只有没有产品内容的分类才能删除。`);
    if (!ok) return;

    setNotice(null);
    const response = await fetch(`/api/admin/categories?id=${row.id}`, { method: "DELETE" });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.ok) {
      setNotice({ type: "error", text: json?.error ?? "删除失败" });
      return;
    }
    setNotice({ type: "success", text: "分类已删除" });
    setRows((current) => current.filter((item) => item.id !== row.id));
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
      {notice ? (
        <div
          className={`mb-4 rounded-xl px-3 py-2 text-sm ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">分类标识</th>
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
                  <input
                    className="h-10 w-full rounded-xl border-slate-200 text-sm"
                    value={row.slug}
                    onChange={(event) => update(index, { slug: event.target.value })}
                  />
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
                  <input
                    className="h-10 w-24 rounded-xl border-slate-200 text-sm"
                    type="number"
                    value={row.sortOrder}
                    onChange={(event) => update(index, { sortOrder: Number(event.target.value) })}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={row.isEnabled}
                    onChange={(event) => update(index, { isEnabled: event.target.checked })}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" onClick={() => save(row)}>
                      保存
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-red-700"
                      onClick={() => remove(row, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </Button>
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
