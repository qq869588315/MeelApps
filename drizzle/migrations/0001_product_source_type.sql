CREATE TYPE product_source_type AS ENUM ('self_built', 'curated');

ALTER TABLE products
  ADD COLUMN source_type product_source_type NOT NULL DEFAULT 'self_built';

CREATE INDEX products_source_type_idx ON products (source_type);
