import type {
  DownloadType,
  Locale,
  Platform,
  ProductSourceType,
  ProductType
} from "@/lib/db/schema";

export type ProductCardView = {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  categoryName: string | null;
  categorySlug: string | null;
  productType: ProductType;
  sourceType: ProductSourceType;
  iconUrl: string | null;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
  updatedAt: string;
  downloadCount: number;
  platforms: Array<{
    id: number;
    platform: Platform;
    isEnabled: boolean;
    downloadType: DownloadType;
  }>;
  languages: Array<{ code: string; name: string }>;
};

export type CategoryFilterView = {
  id: number;
  slug: string;
  name: string;
};

export type HomeText = {
  locale: Locale;
  siteName: string;
  icpNumber: string;
  contactEmail: string;
};
