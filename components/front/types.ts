import type { Locale, Platform, ProductType } from "@/lib/db/schema";

export type ProductCardView = {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  categoryName: string | null;
  categorySlug: string | null;
  productType: ProductType;
  iconUrl: string | null;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
  updatedAt: string;
  platforms: Array<{ id: number; platform: Platform; isEnabled: boolean }>;
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
