import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm, createBlankProduct } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import { getAllCategories } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [admin, categories] = await Promise.all([requireAdmin(), getAllCategories()]);
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.translations.zh?.name ?? category.slug
  }));
  return (
    <AdminShell active="/admin/products" adminEmail={admin.email}>
      <ProductForm
        initial={createBlankProduct(categoryOptions[0]?.id ?? null)}
        categories={categoryOptions}
      />
    </AdminShell>
  );
}
