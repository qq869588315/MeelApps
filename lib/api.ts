import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function withAdmin<T>(handler: () => Promise<T>) {
  try {
    const data = await handler();
    if (data instanceof Response) return data;
    return jsonOk(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "UNAUTHORIZED") {
      return jsonError("Unauthorized", 401);
    }
    if (message.includes("duplicate key") || message.includes("unique constraint")) {
      return jsonError("Duplicate value", 409);
    }
    return jsonError(message, 400);
  }
}
