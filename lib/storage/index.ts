import type { StorageAdapter } from "./types";
import { LocalStorageAdapter } from "./local";

class OssStorageAdapter implements StorageAdapter {
  async store(): Promise<never> {
    throw new Error("OSS storage adapter is reserved for a future release");
  }
}

export function getStorageAdapter(): StorageAdapter {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  if (driver === "oss") return new OssStorageAdapter();
  return new LocalStorageAdapter();
}
