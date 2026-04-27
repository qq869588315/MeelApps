import { NextResponse } from "next/server";
import { detectDevice, hashIp } from "@/lib/device";
import { normalizeLocale } from "@/lib/i18n";
import { findPlatformForDownload, touchDownloadEvent } from "@/lib/product-data";
import { readClientIp } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platformId = Number(url.searchParams.get("platformId"));
  const locale = normalizeLocale(url.searchParams.get("locale"));
  if (!Number.isFinite(platformId)) {
    return NextResponse.json({ ok: false, error: "Invalid platform" }, { status: 400 });
  }

  const row = await findPlatformForDownload(platformId);
  if (!row || row.product.status !== "published") {
    return NextResponse.json({ ok: false, error: "Download not found" }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent");
  const device = detectDevice(userAgent);
  await touchDownloadEvent({
    productId: row.product.id,
    platform: row.platform.platform,
    downloadType: row.platform.downloadType,
    downloadUrl: row.platform.downloadUrl,
    locale,
    userAgent,
    deviceType: device.deviceType,
    detectedOs: device.detectedOs,
    referer: request.headers.get("referer"),
    ipHash: hashIp(readClientIp(request.headers))
  });

  return NextResponse.redirect(new URL(row.platform.downloadUrl, request.url), 302);
}
