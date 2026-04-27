import { requireAdminForApi } from "@/lib/auth";
import { withAdmin } from "@/lib/api";
import { getAdminProducts, saveProductAggregate } from "@/lib/product-data";
import { productPayloadSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  return withAdmin(async () => {
    await requireAdminForApi();
    return getAdminProducts();
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    await requireAdminForApi();
    const payload = productPayloadSchema.parse(await request.json());
    return saveProductAggregate(payload);
  });
}
