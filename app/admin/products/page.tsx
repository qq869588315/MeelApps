import { AdminShell } from "@/components/admin/admin-shell";
import { PageTitle } from "@/components/admin/page-title";
import { ProductTable, type AdminProductRow } from "@/components/admin/product-table";
import { requireAdmin } from "@/lib/auth";
import { getAdminProducts } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [admin, products] = await Promise.all([requireAdmin(), getAdminProducts()]);
  const rows: AdminProductRow[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    status: product.status,
    name: product.translations.zh?.name ?? product.translation.name,
    categoryName: product.category?.name ?? null,
    iconUrl: product.iconUrl,
    platforms: product.platforms.map((platform) => platform.platform),
    downloadCount: product.downloadCount
  }));
  return (
    <AdminShell active="/admin/products" adminEmail={admin.email}>
      <PageTitle title="Products" description="管理产品、草稿、隐藏状态、排序和下载数据。" />
      <ProductTable products={rows} />
    </AdminShell>
  );
}
