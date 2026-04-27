import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const ok = await loginAdmin(body.email ?? "", body.password ?? "");
  if (!ok) return jsonError("邮箱或密码不正确", 401);
  return NextResponse.json({ ok: true });
}
