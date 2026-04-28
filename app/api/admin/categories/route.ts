import { requireAdminForApi } from "@/lib/auth";
import { withAdmin } from "@/lib/api";
import { deleteCategoryIfEmpty, getAllCategories, saveCategory } from "@/lib/product-data";
import { categoryPayloadSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  return withAdmin(async () => {
    await requireAdminForApi();
    return getAllCategories();
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    await requireAdminForApi();
    const payload = categoryPayloadSchema.parse(await request.json());
    return saveCategory(payload);
  });
}

export async function DELETE(request: Request) {
  return withAdmin(async () => {
    await requireAdminForApi();
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) throw new Error("分类 ID 无效");
    return deleteCategoryIfEmpty(id);
  });
}
