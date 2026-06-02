import { AdminShell } from "@/components/admin/admin-shell";
import { PageTitle } from "@/components/admin/page-title";
import { ProductTable, type AdminProductRow } from "@/components/admin/product-table";
import { requireAdmin } from "@/lib/auth";
import { getAdminProducts } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function AdminDraftsPage() {
  const [admin, products] = await Promise.all([requireAdmin(), getAdminProducts("draft")]);
  const rows: AdminProductRow[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    status: product.status,
    sourceType: product.sourceType,
    name: product.translations.zh?.name ?? product.translation.name,
    categoryName: product.category?.name ?? null,
    iconUrl: product.iconUrl,
    platforms: product.platforms.map((platform) => platform.platform),
    downloadCount: product.downloadCount
  }));
  return (
    <AdminShell active="/admin/drafts" adminEmail={admin.email}>
      <PageTitle title="草稿箱" description="草稿产品不会出现在前台。" />
      <ProductTable products={rows} showCreate={false} />
    </AdminShell>
  );
}
