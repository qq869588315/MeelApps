import { requireAdminForApi } from "@/lib/auth";
import { withAdmin } from "@/lib/api";
import { getAllCategories, saveCategory } from "@/lib/product-data";
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
