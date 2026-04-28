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
    if (isDuplicateValueError(error, message)) {
      return jsonError("标识已存在，请换一个值", 409);
    }
    if (message.startsWith("Failed query:")) {
      return jsonError("操作失败，请检查输入内容后重试", 400);
    }
    return jsonError(message, 400);
  }
}

function isDuplicateValueError(error: unknown, message: string) {
  const lower = message.toLowerCase();
  if (
    lower.includes("duplicate key") ||
    lower.includes("unique constraint") ||
    lower.includes("violates unique constraint")
  ) {
    return true;
  }

  let current: unknown = error;
  while (current && typeof current === "object") {
    const record = current as Record<string, unknown>;
    if (record.code === "23505") return true;
    current = record.cause;
  }
  return false;
}
