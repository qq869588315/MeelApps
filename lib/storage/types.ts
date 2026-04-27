export type StoredFile = {
  url: string;
  pathname: string;
  size: number;
  mimeType: string;
  originalName: string;
};

export type StoreFileInput = {
  file: File;
  kind: "image" | "download";
};

export interface StorageAdapter {
  store(input: StoreFileInput): Promise<StoredFile>;
}
