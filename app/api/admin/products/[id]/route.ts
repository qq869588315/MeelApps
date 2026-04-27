import { requireAdminForApi } from "@/lib/auth";
import { withAdmin } from "@/lib/api";
import {
  saveProductAggregate,
  setProductAction,
  softDeleteProduct
} from "@/lib/product-data";
import { productPayloadSchema } from "@/lib/validation";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteProps) {
  return withAdmin(async () => {
    await requireAdminForApi();
    const { id } = await params;
    const payload = productPayloadSchema.parse(await request.json());
    return saveProductAggregate(payload, Number(id));
  });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  return withAdmin(async () => {
    await requireAdminForApi();
    const { id } = await params;
    const body = (await request.json()) as { action?: "publish" | "hide" | "restore" };
    if (!body.action || !["publish", "hide", "restore"].includes(body.action)) {
      throw new Error("Invalid action");
    }
    return setProductAction(Number(id), body.action);
  });
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  return withAdmin(async () => {
    await requireAdminForApi();
    const { id } = await params;
    return softDeleteProduct(Number(id));
  });
}
