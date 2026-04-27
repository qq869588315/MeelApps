import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { StorageAdapter, StoreFileInput, StoredFile } from "./types";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const downloadExtensions = new Set([".exe", ".msi", ".dmg", ".pkg", ".apk", ".zip"]);
const imageMimes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
]);
const downloadMimes = new Set([
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "application/x-msdownload",
  "application/vnd.android.package-archive",
  "application/x-apple-diskimage",
  "application/x-xar"
]);

function safeBaseName(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || "file"}-${randomUUID()}${ext}`;
}

function validateFile(file: File, kind: StoreFileInput["kind"]) {
  const ext = path.extname(file.name).toLowerCase();
  const maxBytes =
    kind === "image"
      ? Number(process.env.IMAGE_MAX_BYTES ?? 10 * 1024 * 1024)
      : Number(process.env.DOWNLOAD_MAX_BYTES ?? 300 * 1024 * 1024);
  const allowedExt = kind === "image" ? imageExtensions : downloadExtensions;
  const allowedMime = kind === "image" ? imageMimes : downloadMimes;

  if (!allowedExt.has(ext)) {
    throw new Error(`Unsupported ${kind} extension`);
  }
  if (file.type && !allowedMime.has(file.type)) {
    throw new Error(`Unsupported ${kind} MIME type`);
  }
  if (file.size > maxBytes) {
    throw new Error(`${kind} file is too large`);
  }
}

export class LocalStorageAdapter implements StorageAdapter {
  async store({ file, kind }: StoreFileInput): Promise<StoredFile> {
    validateFile(file, kind);
    const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "data", "uploads");
    const publicBase = process.env.PUBLIC_UPLOAD_BASE_URL ?? "/uploads";
    const folder = kind === "image" ? "images" : "downloads";
    const filename = safeBaseName(file.name);
    const targetDir = path.resolve(uploadDir, folder);
    const target = path.resolve(targetDir, filename);

    if (!target.startsWith(targetDir)) {
      throw new Error("Unsafe upload path");
    }

    await mkdir(targetDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(target, bytes);

    return {
      url: `${publicBase}/${folder}/${filename}`,
      pathname: target,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      originalName: file.name
    };
  }
}
