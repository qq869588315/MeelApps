CREATE TYPE locale AS ENUM ('zh', 'en');
CREATE TYPE product_status AS ENUM ('draft', 'published', 'hidden', 'deleted');
CREATE TYPE product_type AS ENUM ('desktop', 'mobile', 'web_plugin');
CREATE TYPE platform AS ENUM ('windows', 'macos', 'ios', 'android', 'web', 'browser_extension');
CREATE TYPE download_type AS ENUM ('direct', 'external');
CREATE TYPE badge_type AS ENUM ('app_store', 'google_play', 'microsoft_store', 'direct_download', 'custom');
CREATE TYPE media_type AS ENUM ('icon', 'screenshot');
CREATE TYPE document_type AS ENUM ('help', 'privacy', 'terms');
CREATE TYPE content_type AS ENUM ('markdown', 'external');
CREATE TYPE device_type AS ENUM ('desktop', 'mobile', 'tablet', 'unknown');
CREATE TYPE detected_os AS ENUM ('windows', 'macos', 'ios', 'android', 'unknown');

CREATE TABLE categories (
  id serial PRIMARY KEY,
  slug text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX categories_slug_idx ON categories (slug);

CREATE TABLE category_translations (
  id serial PRIMARY KEY,
  category_id integer NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  locale locale NOT NULL,
  name text NOT NULL,
  description text
);
CREATE UNIQUE INDEX category_translations_unique_locale ON category_translations (category_id, locale);

CREATE TABLE products (
  id serial PRIMARY KEY,
  slug text NOT NULL,
  status product_status NOT NULL DEFAULT 'draft',
  is_featured boolean NOT NULL DEFAULT false,
  is_pinned boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  category_id integer REFERENCES categories(id) ON DELETE SET NULL,
  product_type product_type NOT NULL DEFAULT 'desktop',
  icon_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  hidden_at timestamptz,
  deleted_at timestamptz
);
CREATE UNIQUE INDEX products_slug_idx ON products (slug);
CREATE INDEX products_status_idx ON products (status);

CREATE TABLE product_translations (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale locale NOT NULL,
  name text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL DEFAULT '',
  feature_highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text
);
CREATE UNIQUE INDEX product_translations_unique_locale ON product_translations (product_id, locale);

CREATE TABLE product_languages (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  language_name_zh text NOT NULL,
  language_name_en text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
CREATE INDEX product_languages_product_idx ON product_languages (product_id);

CREATE TABLE product_platforms (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform platform NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  version text,
  release_date text,
  file_size text,
  min_system_requirement text,
  download_type download_type NOT NULL DEFAULT 'external',
  download_url text NOT NULL,
  store_name text,
  badge_type badge_type NOT NULL DEFAULT 'direct_download',
  checksum text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_platforms_product_idx ON product_platforms (product_id);

CREATE TABLE product_media (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  url text NOT NULL,
  alt_text text,
  locale locale,
  platform platform,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_media_product_idx ON product_media (product_id);

CREATE TABLE product_documents (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  locale locale NOT NULL,
  content_type content_type NOT NULL DEFAULT 'markdown',
  content text,
  external_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX product_documents_unique_doc ON product_documents (product_id, type, locale);

CREATE TABLE changelogs (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  version text NOT NULL,
  release_date text NOT NULL,
  locale locale NOT NULL,
  content text NOT NULL,
  is_latest boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX changelogs_product_idx ON changelogs (product_id);

CREATE TABLE download_events (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform platform NOT NULL,
  download_type download_type NOT NULL,
  download_url text NOT NULL,
  locale locale NOT NULL,
  user_agent text,
  device_type device_type NOT NULL DEFAULT 'unknown',
  detected_os detected_os NOT NULL DEFAULT 'unknown',
  referer text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX download_events_product_idx ON download_events (product_id);
CREATE INDEX download_events_created_idx ON download_events (created_at);

CREATE TABLE admins (
  id serial PRIMARY KEY,
  email text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);
CREATE UNIQUE INDEX admins_email_idx ON admins (email);

CREATE TABLE admin_sessions (
  id serial PRIMARY KEY,
  admin_id integer NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX admin_sessions_token_idx ON admin_sessions (token_hash);

CREATE TABLE site_settings (
  id serial PRIMARY KEY,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  locale locale,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX site_settings_unique_setting ON site_settings (key, locale);
