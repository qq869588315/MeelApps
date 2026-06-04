CREATE TEMP TABLE tmp_curated_external_tools (
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
  file_size text NOT NULL,
  min_system_requirement text NOT NULL,
  download_url text NOT NULL,
  changelog_zh text NOT NULL,
  changelog_en text NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_curated_external_tools (
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
  file_size,
  min_system_requirement,
  download_url,
  changelog_zh,
  changelog_en
)
VALUES
  (
    'obsidian',
    'productivity',
    160,
    'Obsidian',
    'Obsidian',
    '本地 Markdown 笔记与知识库工具，适合长期写作、资料整理和个人知识管理。',
    'A local Markdown notes and knowledge-base app for writing, research, and long-term personal knowledge management.',
    $zh$Obsidian 是一款以本地 Markdown 文件为核心的笔记与知识库工具，适合写作、资料整理、项目记录和个人知识管理。它的优势是数据可控、插件生态丰富，文件可以自行备份和迁移。

安装注意事项：创建仓库和用户数据时请手动选择非 C 盘位置，否则默认可能落在 C 盘。$zh$,
    $en$Obsidian is a local Markdown-based notes and knowledge-base app for writing, research, project records, and personal knowledge management. Its strengths are data ownership, a rich plugin ecosystem, and files that remain easy to back up or migrate.

Installation note: choose a vault and user-data location outside the C drive if you are managing disk pressure; defaults may otherwise land on C:.$en$,
    '["本地 Markdown 文件，数据可控", "适合写作、资料整理和知识库", "插件生态丰富", "本站仅提供官方入口，不托管安装包"]'::jsonb,
    '["Local Markdown files with user-controlled data", "Good for writing, research, and knowledge bases", "Rich plugin ecosystem", "MeelApps links to the official source only"]'::jsonb,
    '1.12.7',
    '2026-03-23',
    '295530200 bytes',
    'Windows x64',
    'https://obsidian.md/download',
    $logzh$- 已在 Windows 环境完成下载与安装验证
- 下载入口指向 Obsidian 官方下载页面，本站不托管安装包$logzh$,
    $logen$- Windows download and installation verified by MeelApps
- The download entry points to Obsidian's official download page; MeelApps does not host the installer$logen$
  ),
  (
    'sharex',
    'tools',
    150,
    'ShareX',
    'ShareX',
    '开源 Windows 截图、录屏与分享工具，适合高频截图标注和自动化上传工作流。',
    'An open-source Windows tool for screenshots, screen recording, annotations, and sharing workflows.',
    $zh$ShareX 是一款面向 Windows 的开源截图、录屏和分享工具，适合需要频繁截图、标注、OCR、录屏或自动化上传的用户。它功能密度高，适合作为高级截图工作流工具使用。

安装注意事项：安装后建议在设置里修改个人文件夹路径，默认可能使用 C 盘；关闭窗口按钮会最小化到托盘，无法改为直接关闭应用。$zh$,
    $en$ShareX is an open-source Windows tool for screenshots, screen recording, annotations, OCR, and sharing workflows. It is feature-dense and works well for users who need a powerful capture pipeline.

Installation note: after installation, change the personal folder path in settings if you want to avoid default C-drive usage. The window close button minimizes ShareX to the tray instead of exiting the app.$en$,
    '["截图、标注、录屏与 OCR", "支持上传和自动化工作流", "开源免费", "本站仅提供官方入口，不托管安装包"]'::jsonb,
    '["Screenshots, annotations, screen recording, and OCR", "Upload and automation workflows", "Free and open source", "MeelApps links to the official source only"]'::jsonb,
    '20.2.0',
    '2026-05-22',
    '126171096 bytes',
    'Windows x64',
    'https://getsharex.com/',
    $logzh$- 已在 Windows 环境完成下载与安装验证
- 下载入口指向 ShareX 官方网站，本站不托管安装包$logzh$,
    $logen$- Windows download and installation verified by MeelApps
- The download entry points to the official ShareX website; MeelApps does not host the installer$logen$
  ),
  (
    'localsend',
    'tools',
    140,
    'LocalSend',
    'LocalSend',
    '局域网文件互传工具，无需账号和云端中转，适合多设备之间快速发送文件。',
    'A local-network file sharing app for sending files between devices without accounts or cloud relay.',
    $zh$LocalSend 是一款用于局域网文件互传的工具，可以在同一网络中的设备之间发送文件、文本和内容，无需账号，也不依赖云端中转。它适合替代临时网盘、聊天软件传文件等场景。

安装注意事项：安装后需要选择数据文件保存目录，不然可能默认使用 C 盘。$zh$,
    $en$LocalSend is a local-network sharing app for sending files, text, and content between devices on the same network. It requires no account and avoids cloud relay, making it useful for quick device-to-device transfers.

Installation note: choose a data-file storage directory after installation; otherwise it may default to the C drive.$en$,
    '["局域网内快速传文件", "无需账号和云端中转", "适合临时跨设备传输", "本站仅提供官方入口，不托管安装包"]'::jsonb,
    '["Fast local-network file transfer", "No account or cloud relay required", "Useful for quick cross-device sharing", "MeelApps links to the official source only"]'::jsonb,
    '1.17.0',
    '2025-02-20',
    '14895464 bytes',
    'Windows x64',
    'https://localsend.org/download',
    $logzh$- 已在 Windows 环境完成下载与安装验证
- 下载入口指向 LocalSend 官方下载页面，本站不托管安装包$logzh$,
    $logen$- Windows download and installation verified by MeelApps
- The download entry points to LocalSend's official download page; MeelApps does not host the installer$logen$
  ),
  (
    'flow-launcher',
    'productivity',
    130,
    'Flow Launcher',
    'Flow Launcher',
    'Windows 快速启动器和搜索工具，适合键盘启动应用、查找文件和执行插件工作流。',
    'A Windows launcher and search tool for opening apps, finding files, and running plugin workflows from the keyboard.',
    $zh$Flow Launcher 是一款面向 Windows 的快速启动器和搜索工具，适合用键盘快速打开应用、搜索文件、执行命令和扩展插件工作流。它适合想减少鼠标操作、提升日常启动效率的用户。

安装注意事项：安装程序会强制安装在 C 盘，不可更改安装目录。$zh$,
    $en$Flow Launcher is a Windows launcher and search tool for opening apps, finding files, running commands, and extending workflows with plugins. It is useful for users who prefer keyboard-driven daily work.

Installation note: the installer forces installation on the C drive and does not allow changing the install directory.$en$,
    '["键盘快速启动应用", "搜索文件和执行命令", "支持插件扩展", "本站仅提供官方入口，不托管安装包"]'::jsonb,
    '["Keyboard-driven app launching", "File search and command execution", "Plugin support", "MeelApps links to the official source only"]'::jsonb,
    '2.1.2',
    '2026-05-10',
    '101487616 bytes',
    'Windows x64',
    'https://www.flowlauncher.com/',
    $logzh$- 已在 Windows 环境完成下载与安装验证
- 下载入口指向 Flow Launcher 官方网站，本站不托管安装包$logzh$,
    $logen$- Windows download and installation verified by MeelApps
- The download entry points to the official Flow Launcher website; MeelApps does not host the installer$logen$
  ),
  (
    'everything',
    'productivity',
    120,
    'Everything',
    'Everything',
    'Windows 文件快速搜索工具，适合在大量本地文件中秒级定位文件和文件夹。',
    'A fast Windows file search utility for locating files and folders almost instantly.',
    $zh$Everything 是一款经典的 Windows 文件快速搜索工具，适合在大量本地文件中快速定位文件和文件夹。它启动快、占用低，适合替代系统自带搜索完成日常文件查找。
$zh$,
    $en$Everything is a classic Windows file search utility for locating local files and folders quickly. It is lightweight, fast to start, and useful as a practical replacement for slower built-in search workflows.
$en$,
    '["本地文件秒级搜索", "轻量、快速、占用低", "适合高频查找文件", "本站仅提供官方入口，不托管安装包"]'::jsonb,
    '["Near-instant local file search", "Lightweight and fast", "Good for frequent file lookup", "MeelApps links to the official source only"]'::jsonb,
    '1.4.1.1032',
    '2026-01-23',
    '1998736 bytes',
    'Windows x64',
    'https://www.voidtools.com/',
    $logzh$- 已在 Windows 环境完成下载与安装验证
- 下载入口指向 voidtools 官方网站，本站不托管安装包$logzh$,
    $logen$- Windows download and installation verified by MeelApps
- The download entry points to the official voidtools website; MeelApps does not host the installer$logen$
  ),
  (
    '7zip',
    'tools',
    110,
    '7-Zip',
    '7-Zip',
    '开源压缩与解压工具，支持 7z、ZIP、RAR 等常见格式，适合日常文件归档。',
    'An open-source file archiver for compressing, extracting, and managing common archive formats.',
    $zh$7-Zip 是一款开源压缩与解压工具，支持 7z、ZIP、RAR 等常见压缩格式，适合日常文件归档、解压和压缩包管理。它体积小、稳定、免费，是 Windows 常用基础工具之一。
$zh$,
    $en$7-Zip is an open-source file archiver for compressing, extracting, and managing common archive formats such as 7z, ZIP, and RAR. It is small, stable, free, and widely used as a basic Windows utility.
$en$,
    '["支持常见压缩格式", "体积小、稳定、免费", "适合日常压缩与解压", "本站仅提供官方入口，不托管安装包"]'::jsonb,
    '["Supports common archive formats", "Small, stable, and free", "Useful for daily compression and extraction", "MeelApps links to the official source only"]'::jsonb,
    '26.01',
    '2026-04-27',
    '1658851 bytes',
    'Windows x64',
    'https://www.7-zip.org/download.html',
    $logzh$- 已在 Windows 环境完成下载与安装验证
- 下载入口指向 7-Zip 官方下载页面，本站不托管安装包$logzh$,
    $logen$- Windows download and installation verified by MeelApps
- The download entry points to the official 7-Zip download page; MeelApps does not host the installer$logen$
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
  false,
  data.sort_order,
  categories.id,
  'desktop'::product_type,
  'curated'::product_source_type,
  NULL,
  now(),
  NULL,
  NULL,
  now()
FROM tmp_curated_external_tools data
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
  INNER JOIN tmp_curated_external_tools data ON data.slug = products.slug
);

DELETE FROM product_languages
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_curated_external_tools data ON data.slug = products.slug
);

DELETE FROM product_platforms
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_curated_external_tools data ON data.slug = products.slug
);

DELETE FROM product_media
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_curated_external_tools data ON data.slug = products.slug
);

DELETE FROM product_documents
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_curated_external_tools data ON data.slug = products.slug
);

DELETE FROM changelogs
WHERE product_id IN (
  SELECT products.id
  FROM products
  INNER JOIN tmp_curated_external_tools data ON data.slug = products.slug
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
FROM tmp_curated_external_tools data
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
FROM tmp_curated_external_tools data
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
  data.file_size,
  data.min_system_requirement,
  'external'::download_type,
  data.download_url,
  'Official Website',
  'custom'::badge_type,
  NULL,
  10
FROM tmp_curated_external_tools data
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
  'en-US',
  '英文',
  'English',
  10
FROM tmp_curated_external_tools data
INNER JOIN products ON products.slug = data.slug;

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
  'screenshot'::media_type,
  media.url,
  media.alt_text,
  NULL::locale,
  'windows'::platform,
  media.sort_order
FROM (
  VALUES
    ('obsidian', '/demo/obsidian-preview-01.png', 'Obsidian Windows preview 1', 10),
    ('obsidian', '/demo/obsidian-preview-02.png', 'Obsidian Windows preview 2', 20),
    ('obsidian', '/demo/obsidian-preview-03.png', 'Obsidian Windows preview 3', 30),
    ('sharex', '/demo/sharex-preview-01.png', 'ShareX Windows preview 1', 10),
    ('sharex', '/demo/sharex-preview-02.png', 'ShareX Windows preview 2', 20),
    ('localsend', '/demo/localsend-preview-01.png', 'LocalSend Windows preview 1', 10),
    ('localsend', '/demo/localsend-preview-02.png', 'LocalSend Windows preview 2', 20),
    ('localsend', '/demo/localsend-preview-03.png', 'LocalSend Windows preview 3', 30),
    ('flow-launcher', '/demo/flow-launcher-preview-01.png', 'Flow Launcher Windows preview 1', 10),
    ('flow-launcher', '/demo/flow-launcher-preview-02.png', 'Flow Launcher Windows preview 2', 20),
    ('flow-launcher', '/demo/flow-launcher-preview-03.png', 'Flow Launcher Windows preview 3', 30),
    ('everything', '/demo/everything-preview-01.png', 'Everything Windows preview 1', 10),
    ('everything', '/demo/everything-preview-02.png', 'Everything Windows preview 2', 20),
    ('7zip', '/demo/7zip-preview-01.png', '7-Zip Windows preview 1', 10),
    ('7zip', '/demo/7zip-preview-02.png', '7-Zip Windows preview 2', 20)
) AS media(slug, url, alt_text, sort_order)
INNER JOIN products ON products.slug = media.slug;

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
FROM tmp_curated_external_tools data
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
FROM tmp_curated_external_tools data
INNER JOIN products ON products.slug = data.slug;
