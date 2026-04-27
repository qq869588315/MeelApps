import { requireAdminForApi } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { getStorageAdapter } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAdminForApi();
    const form = await request.formData();
    const file = form.get("file");
    const kind = form.get("kind");
    if (!(file instanceof File)) return jsonError("Missing file", 400);
    if (kind !== "image" && kind !== "download") return jsonError("Invalid upload kind", 400);
    const adapter = getStorageAdapter();
    const result = await adapter.store({ file, kind });
    return jsonOk(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    if (message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError(message, 400);
  }
}
