import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const localeEnum = pgEnum("locale", ["zh", "en"]);
export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "hidden",
  "deleted"
]);
export const productTypeEnum = pgEnum("product_type", [
  "desktop",
  "mobile",
  "web_plugin"
]);
export const platformEnum = pgEnum("platform", [
  "windows",
  "macos",
  "ios",
  "android",
  "web",
  "browser_extension"
]);
export const downloadTypeEnum = pgEnum("download_type", ["direct", "external"]);
export const badgeTypeEnum = pgEnum("badge_type", [
  "app_store",
  "google_play",
  "microsoft_store",
  "direct_download",
  "custom"
]);
export const mediaTypeEnum = pgEnum("media_type", ["icon", "screenshot"]);
export const documentTypeEnum = pgEnum("document_type", [
  "help",
  "privacy",
  "terms"
]);
export const contentTypeEnum = pgEnum("content_type", ["markdown", "external"]);
export const deviceTypeEnum = pgEnum("device_type", [
  "desktop",
  "mobile",
  "tablet",
  "unknown"
]);
export const detectedOsEnum = pgEnum("detected_os", [
  "windows",
  "macos",
  "ios",
  "android",
  "unknown"
]);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug)
  })
);

export const categoryTranslations = pgTable(
  "category_translations",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    name: text("name").notNull(),
    description: text("description")
  },
  (table) => ({
    uniqueLocale: uniqueIndex("category_translations_unique_locale").on(
      table.categoryId,
      table.locale
    )
  })
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    status: productStatusEnum("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPinned: boolean("is_pinned").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null"
    }),
    productType: productTypeEnum("product_type").notNull().default("desktop"),
    iconUrl: text("icon_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    hiddenAt: timestamp("hidden_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    statusIdx: index("products_status_idx").on(table.status)
  })
);

export const productTranslations = pgTable(
  "product_translations",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull(),
    fullDescription: text("full_description").notNull().default(""),
    featureHighlights: jsonb("feature_highlights").$type<string[]>().notNull().default([]),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description")
  },
  (table) => ({
    uniqueLocale: uniqueIndex("product_translations_unique_locale").on(
      table.productId,
      table.locale
    )
  })
);

export const productLanguages = pgTable(
  "product_languages",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull(),
    languageNameZh: text("language_name_zh").notNull(),
    languageNameEn: text("language_name_en").notNull(),
    sortOrder: integer("sort_order").notNull().default(0)
  },
  (table) => ({
    productIdx: index("product_languages_product_idx").on(table.productId)
  })
);

export const productPlatforms = pgTable(
  "product_platforms",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    platform: platformEnum("platform").notNull(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    version: text("version"),
    releaseDate: text("release_date"),
    fileSize: text("file_size"),
    minSystemRequirement: text("min_system_requirement"),
    downloadType: downloadTypeEnum("download_type").notNull().default("external"),
    downloadUrl: text("download_url").notNull(),
    storeName: text("store_name"),
    badgeType: badgeTypeEnum("badge_type").notNull().default("direct_download"),
    checksum: text("checksum"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    productIdx: index("product_platforms_product_idx").on(table.productId)
  })
);

export const productMedia = pgTable(
  "product_media",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: mediaTypeEnum("type").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text"),
    locale: localeEnum("locale"),
    platform: platformEnum("platform"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    productIdx: index("product_media_product_idx").on(table.productId)
  })
);

export const productDocuments = pgTable(
  "product_documents",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: documentTypeEnum("type").notNull(),
    locale: localeEnum("locale").notNull(),
    contentType: contentTypeEnum("content_type").notNull().default("markdown"),
    content: text("content"),
    externalUrl: text("external_url"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    uniqueDoc: uniqueIndex("product_documents_unique_doc").on(
      table.productId,
      table.type,
      table.locale
    )
  })
);

export const changelogs = pgTable(
  "changelogs",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    version: text("version").notNull(),
    releaseDate: text("release_date").notNull(),
    locale: localeEnum("locale").notNull(),
    content: text("content").notNull(),
    isLatest: boolean("is_latest").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    productIdx: index("changelogs_product_idx").on(table.productId)
  })
);

export const downloadEvents = pgTable(
  "download_events",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    platform: platformEnum("platform").notNull(),
    downloadType: downloadTypeEnum("download_type").notNull(),
    downloadUrl: text("download_url").notNull(),
    locale: localeEnum("locale").notNull(),
    userAgent: text("user_agent"),
    deviceType: deviceTypeEnum("device_type").notNull().default("unknown"),
    detectedOs: detectedOsEnum("detected_os").notNull().default("unknown"),
    referer: text("referer"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    productIdx: index("download_events_product_idx").on(table.productId),
    createdIdx: index("download_events_created_idx").on(table.createdAt)
  })
);

export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true })
  },
  (table) => ({
    emailIdx: uniqueIndex("admins_email_idx").on(table.email)
  })
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: serial("id").primaryKey(),
    adminId: integer("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    tokenIdx: uniqueIndex("admin_sessions_token_idx").on(table.tokenHash)
  })
);

export const siteSettings = pgTable(
  "site_settings",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    value: text("value").notNull().default(""),
    locale: localeEnum("locale"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    uniqueSetting: uniqueIndex("site_settings_unique_setting").on(table.key, table.locale)
  })
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  translations: many(productTranslations),
  languages: many(productLanguages),
  platforms: many(productPlatforms),
  media: many(productMedia),
  documents: many(productDocuments),
  changelogs: many(changelogs)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  translations: many(categoryTranslations),
  products: many(products)
}));

export type Locale = "zh" | "en";
export type ProductStatus = "draft" | "published" | "hidden" | "deleted";
export type ProductType = "desktop" | "mobile" | "web_plugin";
export type Platform = "windows" | "macos" | "ios" | "android" | "web" | "browser_extension";
export type DownloadType = "direct" | "external";
export type BadgeType =
  | "app_store"
  | "google_play"
  | "microsoft_store"
  | "direct_download"
  | "custom";
export type DocumentType = "help" | "privacy" | "terms";

export type Product = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;
export type ProductTranslation = typeof productTranslations.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type CategoryTranslation = typeof categoryTranslations.$inferSelect;
export type ProductLanguage = typeof productLanguages.$inferSelect;
export type ProductPlatform = typeof productPlatforms.$inferSelect;
export type ProductMedia = typeof productMedia.$inferSelect;
export type ProductDocument = typeof productDocuments.$inferSelect;
export type Changelog = typeof changelogs.$inferSelect;
