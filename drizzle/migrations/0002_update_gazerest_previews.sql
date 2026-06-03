WITH target_product AS (
  SELECT id
  FROM products
  WHERE slug = 'gazerest'
  LIMIT 1
),
removed AS (
  DELETE FROM product_media
  WHERE product_id IN (SELECT id FROM target_product)
    AND type = 'screenshot'
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
  preview.url,
  preview.alt_text,
  NULL::locale,
  'windows'::platform,
  preview.sort_order
FROM target_product
CROSS JOIN (
  VALUES
    ('/demo/gazerest-preview-01.png', 'GazeRest preview 1', 10),
    ('/demo/gazerest-preview-02.png', 'GazeRest preview 2', 20),
    ('/demo/gazerest-preview-03.png', 'GazeRest preview 3', 30),
    ('/demo/gazerest-preview-04.png', 'GazeRest preview 4', 40),
    ('/demo/gazerest-preview-05.png', 'GazeRest preview 5', 50)
) AS preview(url, alt_text, sort_order);
