WITH target_product AS (
  SELECT id
  FROM products
  WHERE slug = 'agents-memory'
),
removed_existing AS (
  DELETE FROM product_media
  WHERE product_id IN (SELECT id FROM target_product)
    AND url IN (
      '/demo/agents-memory-preview-02.svg',
      '/demo/agents-memory-preview-03.svg'
    )
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
  target_product.id,
  'screenshot'::media_type,
  media.url,
  media.alt_text,
  NULL::locale,
  'windows'::platform,
  media.sort_order
FROM target_product
CROSS JOIN (
  VALUES
    ('/demo/agents-memory-preview-02.svg', 'Agents Memory context profiles preview', 20),
    ('/demo/agents-memory-preview-03.svg', 'Agents Memory handoff workflow preview', 30)
) AS media(url, alt_text, sort_order);
