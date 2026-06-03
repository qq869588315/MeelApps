WITH target_products AS (
  SELECT id
  FROM products
  WHERE slug IN ('gazerest', 'gaze-rest')
),
removed AS (
  DELETE FROM product_media
  WHERE product_id IN (SELECT id FROM target_products)
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
  target_products.id,
  'screenshot'::media_type,
  preview.url,
  preview.alt_text,
  NULL::locale,
  'windows'::platform,
  preview.sort_order
FROM target_products
CROSS JOIN (
  VALUES
    ('/demo/gazerest-preview-01.png', 'GazeRest preview 1', 10),
    ('/demo/gazerest-preview-02.png', 'GazeRest preview 2', 20),
    ('/demo/gazerest-preview-03.png', 'GazeRest preview 3', 30),
    ('/demo/gazerest-preview-04.png', 'GazeRest preview 4', 40),
    ('/demo/gazerest-preview-05.png', 'GazeRest preview 5', 50)
) AS preview(url, alt_text, sort_order);
