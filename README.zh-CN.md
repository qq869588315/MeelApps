# Meel Apps

[English](README.md) | 简体中文

Meel Apps 是一个个人产品展示与轻量分发网站。它把前台产品列表、产品详情、下载记录、后台管理、本地上传、多语言内容和基础统计放在同一个 Next.js App Router 应用里，适合展示桌面工具、移动 App 和后续插件类产品。

## 功能特性

- 前台产品列表支持搜索、分类、平台、类型、语言和排序筛选。
- 产品详情页展示截图、版本与系统、更新日志、文档、隐私政策、服务条款和相关推荐。
- “版本与系统”表格按平台提供下载入口，点击下载会先记录事件，再跳转到本地文件或外部地址。
- 支持中文和英文路由：`/zh`、`/en`，根路径 `/` 默认跳转到 `/zh`。
- 后台包含 Dashboard、Products、Drafts、Categories、Stats、Settings。
- 产品编辑页按标签组织：基础信息、中文内容、英文内容、平台与下载、图片素材、更新日志、文档与政策、SEO。
- 本地上传适配器支持图片和安装包，并校验 MIME、扩展名、大小、文件名和路径穿越。
- PostgreSQL + Drizzle ORM 管理数据库结构和迁移。
- Docker Compose 提供 app、postgres、umami、caddy 四个服务。

## 技术栈

- Next.js App Router、React、TypeScript
- Tailwind CSS、本地基础组件、lucide-react 图标
- PostgreSQL、Drizzle ORM
- Cookie Session 后台登录，密码使用 bcrypt 哈希
- 本地文件存储，预留 OSS Storage Adapter 接口
- Umami 自托管统计
- Docker Compose、Caddy HTTPS 反向代理

## 目录结构

```text
app/                  Next.js 路由、后台页面、前台页面和 API
components/           前台组件与通用 UI 组件
lib/                  数据库、登录、存储、Markdown、设置和产品数据逻辑
drizzle/              SQL 迁移文件
scripts/              迁移、种子数据和管理员初始化脚本
docker/               PostgreSQL 初始化脚本
public/               本地 demo 媒体和公共资源
```

## 环境要求

- Node.js 20+
- pnpm 10+
- 本地开发需要 PostgreSQL 16+，也可以直接使用 Docker Desktop 启动 Compose 服务

## 环境变量

先复制示例文件：

```bash
cp .env.example .env
```

关键变量：

```env
APP_URL=https://apps.aameel.top
DATABASE_URL=postgres://meel_apps_user:password@postgres:5432/meel_apps
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=
ADMIN_PASSWORD_HASH=
SESSION_SECRET=change_me_to_a_long_random_secret
STORAGE_DRIVER=local
UPLOAD_DIR=/data/uploads
PUBLIC_UPLOAD_BASE_URL=/uploads
UMAMI_URL=https://apps.aameel.top/stats
```

生产环境必须修改 `SESSION_SECRET`，并通过 `ADMIN_PASSWORD` 或 `ADMIN_PASSWORD_HASH` 设置真实后台密码。

## 本地开发

安装依赖：

```bash
corepack enable
pnpm install
```

用 Docker 启动 PostgreSQL：

```bash
docker compose up -d postgres
```

初始化数据库：

```bash
pnpm db:migrate
pnpm db:seed
pnpm admin:init
```

启动开发服务：

```bash
pnpm dev
```

访问地址：

- 前台：`http://127.0.0.1:3000/zh`
- 后台登录：`http://127.0.0.1:3000/admin/login`

种子数据默认管理员：

- 邮箱：`admin@example.com`
- 密码：`change_me_admin_password`

正式部署前请务必修改默认密码。

## 常用脚本

```bash
pnpm dev          # 启动开发服务
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务
pnpm typecheck    # TypeScript 类型检查
pnpm lint         # ESLint 检查
pnpm db:generate  # 生成 Drizzle 迁移
pnpm db:migrate   # 执行数据库迁移
pnpm db:seed      # 写入示例分类、产品、媒体、文档和更新日志
pnpm admin:init   # 根据环境变量创建或更新管理员
```

## Docker 部署

复制并修改环境变量：

```bash
cp .env.example .env
```

启动服务：

```bash
docker compose up -d --build
```

初始化数据库：

```bash
docker compose exec app pnpm db:migrate
docker compose exec app pnpm db:seed
docker compose exec app pnpm admin:init
```

Compose 服务包含：

- `app`：Next.js 前台、后台和 API
- `postgres`：业务数据库和 Umami 数据库
- `umami`：自托管访问统计
- `caddy`：为 `apps.aameel.top`、`/stats/*`、`/uploads/*` 提供 HTTPS 和反向代理

持久化数据：

- PostgreSQL 数据保存在 `postgres_data` volume。
- 上传文件保存在 `uploads` volume。
- Caddy 状态保存在 `caddy_data` 和 `caddy_config`。

## 存储与上传

当前版本完整实现 local storage adapter：

- 图片写入 `UPLOAD_DIR/images`。
- 安装包写入 `UPLOAD_DIR/downloads`。
- 公开访问路径通过 `PUBLIC_UPLOAD_BASE_URL` 生成。

OSS adapter 接口已预留，当前作为 TODO。

默认上传限制：

- 图片：10 MB
- 安装包：300 MB

可以通过 `IMAGE_MAX_BYTES` 和 `DOWNLOAD_MAX_BYTES` 调整。

## 路由

前台：

- `/`
- `/zh`
- `/en`
- `/[locale]/apps/[slug]`
- `/[locale]/apps/[slug]/help`
- `/[locale]/apps/[slug]/privacy`
- `/[locale]/apps/[slug]/terms`

后台：

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/drafts`
- `/admin/categories`
- `/admin/stats`
- `/admin/settings`

API：

- `/api/admin/auth/login`
- `/api/admin/auth/logout`
- `/api/admin/products`
- `/api/admin/products/[id]`
- `/api/admin/categories`
- `/api/admin/settings`
- `/api/admin/upload`
- `/api/download?platformId=...&locale=zh`

## 验证

发布前建议执行：

```bash
pnpm typecheck
pnpm lint
pnpm build
```

建议人工验收：

- 后台登录和退出
- 新建草稿、发布、隐藏、删除限制
- 上传图片和安装包
- 草稿、隐藏、删除产品在前台不可见
- `/zh` 和 `/en` 语言切换
- 产品详情页按系统下载并记录下载事件
- Docker 重启后数据库和上传文件不丢失

## 安全说明

- 后台页面和 `/api/admin/*` 服务端都会校验登录态。
- 管理员密码使用 bcrypt 哈希存储。
- Session Cookie 使用 HttpOnly，生产环境启用 Secure，并设置 SameSite。
- Markdown 渲染前会进行安全清理。
- 上传接口校验 MIME、扩展名、大小、文件名和最终路径。
- 已发布产品后端不允许直接删除，必须先隐藏。
- 生产部署前请替换所有默认密钥和默认密码。
