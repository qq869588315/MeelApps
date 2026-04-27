import { createHash } from "node:crypto";

export type DeviceInfo = {
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  detectedOs: "windows" | "macos" | "ios" | "android" | "unknown";
};

export function detectDevice(userAgent: string | null | undefined): DeviceInfo {
  const ua = (userAgent ?? "").toLowerCase();
  const isTablet = /ipad|tablet/.test(ua);
  const isMobile = /mobile|iphone|android/.test(ua);

  let detectedOs: DeviceInfo["detectedOs"] = "unknown";
  if (/iphone|ipad|ipod/.test(ua)) detectedOs = "ios";
  else if (/android/.test(ua)) detectedOs = "android";
  else if (/windows/.test(ua)) detectedOs = "windows";
  else if (/mac os|macintosh/.test(ua)) detectedOs = "macos";

  let deviceType: DeviceInfo["deviceType"] = "unknown";
  if (isTablet) deviceType = "tablet";
  else if (isMobile) deviceType = "mobile";
  else if (detectedOs === "windows" || detectedOs === "macos") deviceType = "desktop";

  return { detectedOs, deviceType };
}

export function hashIp(ip: string, secret = process.env.SESSION_SECRET ?? "dev") {
  if (!ip) return null;
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}
