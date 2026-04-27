import { AdminShell } from "@/components/admin/admin-shell";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { PageTitle } from "@/components/admin/page-title";
import { requireAdmin } from "@/lib/auth";
import { getAllCategories } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [admin, categories] = await Promise.all([requireAdmin(), getAllCategories()]);
  return (
    <AdminShell active="/admin/categories" adminEmail={admin.email}>
      <PageTitle title="Categories" description="维护产品分类的中英文名称和排序。" />
      <CategoriesManager
        categories={categories.map((category) => ({
          id: category.id,
          slug: category.slug,
          sortOrder: category.sortOrder,
          isEnabled: category.isEnabled,
          translations: {
            zh: category.translations.zh
              ? { name: category.translations.zh.name }
              : null,
            en: category.translations.en
              ? { name: category.translations.en.name }
              : null
          }
        }))}
      />
    </AdminShell>
  );
}
