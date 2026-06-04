WITH icon_data(slug, icon_url, alt_text) AS (
  VALUES
    ('obsidian', '/demo/obsidian-icon.png', 'Obsidian icon'),
    ('sharex', '/demo/sharex-icon.png', 'ShareX icon'),
    ('localsend', '/demo/localsend-icon.png', 'LocalSend icon'),
    ('flow-launcher', '/demo/flow-launcher-icon.png', 'Flow Launcher icon'),
    ('everything', '/demo/everything-icon.png', 'Everything icon'),
    ('7zip', '/demo/7zip-icon.png', '7-Zip icon')
),
updated_products AS (
  UPDATE products
  SET icon_url = icon_data.icon_url,
      updated_at = now()
  FROM icon_data
  WHERE products.slug = icon_data.slug
  RETURNING products.id, icon_data.slug, icon_data.icon_url, icon_data.alt_text
),
removed_icons AS (
  DELETE FROM product_media
  WHERE product_id IN (SELECT id FROM updated_products)
    AND type = 'icon'
  RETURNING id
)
INSERT INTO product_media (
  product_id,
  type,
  url,
  alt_text,
  locale,
  platform,
  sort_order
)
SELECT
  updated_products.id,
  'icon'::media_type,
  updated_products.icon_url,
  updated_products.alt_text,
  NULL::locale,
  NULL::platform,
  0
FROM updated_products;
