CREATE TEMP TABLE tmp_agents_memory_product (
  slug text PRIMARY KEY,
  category_slug text NOT NULL,
  sort_order integer NOT NULL,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  short_zh text NOT NULL,
  short_en text NOT NULL,
  full_zh text NOT NULL,
  full_en text NOT NULL,
  features_zh jsonb NOT NULL,
  features_en jsonb NOT NULL,
  version text NOT NULL,
  release_date text NOT NULL,
  min_system_requirement text NOT NULL,
  download_url text NOT NULL,
  changelog_zh text NOT NULL,
  changelog_en text NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_agents_memory_product (
  slug,
  category_slug,
  sort_order,
  name_zh,
  name_en,
  short_zh,
  short_en,
  full_zh,
  full_en,
  features_zh,
  features_en,
  version,
  release_date,
  min_system_requirement,
  download_url,
  changelog_zh,
  changelog_en
)
VALUES (
  'agents-memory',
  'productivity',
  220,
  'Agents Memory',
  'Agents Memory',
  '本地优先的 AI Agent 记忆运行时，用来在上下文压缩、跨会话协作和多工具切换时保留关键状态。',
  'A local-first memory runtime for AI agents that preserves key state across context compaction, sessions, and tools.',
  $zh$Agents Memory 是一个本地优先的 AI Agent 记忆运行时，用来把项目规则、会话检查点、活跃任务、长期记忆和敏感信息引用组织在同一个可检索的上下文系统里。它适合需要让 Codex、Claude、Cursor 或其它 agent 接续工作的个人开发环境，重点解决上下文压缩后状态丢失、跨会话重复交代背景、以及多工具协作时项目知识分散的问题。

当前版本提供命令行工具 `am`、项目注册、会话启动、checkpoint、上下文检索、活动索引、legacy 记忆迁移、索引重建和 `am-secrets` 敏感信息引用管理。新的 `get-context --profile lean|normal|deep` 可以按任务大小选择上下文档位：lean 更适合快速接续，normal 适合日常开发，deep 用于需要更完整历史的复杂任务。

Agents Memory 不会重写用户已有的 `AGENTS.md`、`CLAUDE.md` 和 `.cursorrules`，只会在备份后追加受管理的规则块。敏感信息应保存到 AM 的秘钥系统中，普通记忆和文档只保留 `secret_ref`。$zh$,
  $en$Agents Memory is a local-first memory runtime for AI agents. It organizes project rules, session checkpoints, active tasks, long-term memory, and sensitive secret references into a searchable context system. It is built for personal development environments where Codex, Claude, Cursor, or other agents need to resume work without repeating project background after context compaction.

The current version provides the `am` CLI, project registration, session start, checkpoints, context retrieval, active indexes, legacy memory migration, index rebuilding, and `am-secrets` secret reference management. The new `get-context --profile lean|normal|deep` option lets agents choose a context pack size: lean for quick handoff, normal for daily work, and deep for complex tasks that need more history.

Agents Memory does not rewrite user-owned `AGENTS.md`, `CLAUDE.md`, or `.cursorrules`; it backs up existing files and appends only a managed block. Sensitive values should stay in AM secrets, while ordinary memory and docs keep only `secret_ref` references.$en$,
  '[
    "上下文压缩前保存关键会话状态",
    "跨会话共享项目知识和活跃任务",
    "支持 lean / normal / deep 三档上下文包",
    "通过 am-secrets 管理敏感信息引用",
    "适配 Codex、Claude、Cursor 等多种 agent 工作流"
  ]'::jsonb,
  '[
    "Keeps key session state before context compaction",
    "Shares project knowledge and active tasks across sessions",
    "Supports lean / normal / deep context profiles",
    "Manages sensitive references through am-secrets",
    "Fits Codex, Claude, Cursor, and other agent workflows"
  ]'::jsonb,
  '0.1.0',
  '2026-06-12',
  'Windows with Node.js 20+',
  'https://github.com/qq869588315/AgentsMemory',
  $logzh$- 新增 `get-context --profile lean|normal|deep` 上下文档位
- 默认 README 改为中文，并保留 `README-en.md`
- 补充 AM 烟测覆盖和测试临时目录忽略规则$logzh$,
  $logen$- Added `get-context --profile lean|normal|deep` context profiles
- Made the default README Chinese and kept `README-en.md`
- Expanded smoke-test coverage and ignored temporary test output$logen$
);

INSERT INTO products (
  slug,
  status,
  is_featured,
  is_pinned,
  sort_order,
  category_id,
  product_type,
  source_type,
  icon_url,
  published_at,
  hidden_at,
  deleted_at,
  updated_at
)
SELECT
  data.slug,
  'published'::product_status,
  true,
  true,
  data.sort_order,
  categories.id,
  'desktop'::product_type,
  'self_built'::product_source_type,
  '/demo/agents-memory-icon.svg',
  now(),
  NULL,
  NULL,
  now()
FROM tmp_agents_memory_product data
LEFT JOIN categories ON categories.slug = data.category_slug
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  is_pinned = EXCLUDED.is_pinned,
  sort_order = EXCLUDED.sort_order,
  category_id = EXCLUDED.category_id,
  product_type = EXCLUDED.product_type,
  source_type = EXCLUDED.source_type,
  icon_url = EXCLUDED.icon_url,
  published_at = COALESCE(products.published_at, now()),
  hidden_at = NULL,
  deleted_at = NULL,
  updated_at = now();

DELETE FROM product_translations
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_agents_memory_product data ON data.slug = products.slug
);

DELETE FROM product_languages
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_agents_memory_product data ON data.slug = products.slug
);

DELETE FROM product_platforms
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_agents_memory_product data ON data.slug = products.slug
);

DELETE FROM product_media
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_agents_memory_product data ON data.slug = products.slug
);

DELETE FROM product_documents
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_agents_memory_product data ON data.slug = products.slug
);

DELETE FROM changelogs
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_agents_memory_product data ON data.slug = products.slug
);

INSERT INTO product_translations (
  product_id,
  locale,
  name,
  short_description,
  full_description,
  feature_highlights,
  seo_title,
  seo_description
)
SELECT
  products.id,
  'zh'::locale,
  data.name_zh,
  data.short_zh,
  data.full_zh,
  data.features_zh,
  data.name_zh,
  data.short_zh
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug
UNION ALL
SELECT
  products.id,
  'en'::locale,
  data.name_en,
  data.short_en,
  data.full_en,
  data.features_en,
  data.name_en,
  data.short_en
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug;

INSERT INTO product_platforms (
  product_id,
  platform,
  is_enabled,
  version,
  release_date,
  file_size,
  min_system_requirement,
  download_type,
  download_url,
  store_name,
  badge_type,
  checksum,
  sort_order
)
SELECT
  products.id,
  'windows'::platform,
  true,
  data.version,
  data.release_date,
  NULL,
  data.min_system_requirement,
  'external'::download_type,
  data.download_url,
  'GitHub',
  'custom'::badge_type,
  NULL,
  10
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug;

INSERT INTO product_languages (
  product_id,
  language_code,
  language_name_zh,
  language_name_en,
  sort_order
)
SELECT
  products.id,
  language.language_code,
  language.language_name_zh,
  language.language_name_en,
  language.sort_order
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug
CROSS JOIN (
  VALUES
    ('zh-CN', '中文', 'Chinese', 0),
    ('en-US', '英文', 'English', 10)
) AS language(language_code, language_name_zh, language_name_en, sort_order);

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
  products.id,
  media.type::media_type,
  media.url,
  media.alt_text,
  NULL::locale,
  media.platform::platform,
  media.sort_order
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug
CROSS JOIN (
  VALUES
    ('icon', '/demo/agents-memory-icon.svg', 'Agents Memory icon', NULL, 0),
    ('screenshot', '/demo/agents-memory-preview.svg', 'Agents Memory terminal preview', 'windows', 10)
) AS media(type, url, alt_text, platform, sort_order);

INSERT INTO product_documents (
  product_id,
  type,
  locale,
  content_type,
  content,
  external_url
)
SELECT
  products.id,
  'help'::document_type,
  docs.locale::locale,
  'external'::content_type,
  NULL,
  docs.external_url
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug
CROSS JOIN (
  VALUES
    ('zh', 'https://github.com/qq869588315/AgentsMemory/blob/master/README.md'),
    ('en', 'https://github.com/qq869588315/AgentsMemory/blob/master/README-en.md')
) AS docs(locale, external_url);

INSERT INTO changelogs (
  product_id,
  version,
  release_date,
  locale,
  content,
  is_latest,
  sort_order
)
SELECT
  products.id,
  data.version,
  data.release_date,
  'zh'::locale,
  data.changelog_zh,
  true,
  10
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug
UNION ALL
SELECT
  products.id,
  data.version,
  data.release_date,
  'en'::locale,
  data.changelog_en,
  true,
  10
FROM tmp_agents_memory_product data
INNER JOIN products ON products.slug = data.slug;
