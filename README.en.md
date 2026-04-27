# Meel Apps

English | [简体中文](README.md)

Meel Apps is a personal product showcase and lightweight app distribution site. It combines the public product catalog, product detail pages, download tracking, a small admin console, local uploads, multilingual content, and basic analytics in one Next.js App Router application.

## Features

- Public product listing with search, category, platform, type, language, and sort filters.
- Product detail pages with screenshots, changelog, documents, localized content, and per-platform download buttons.
- Chinese and English routes under `/zh` and `/en`; `/` redirects to `/zh`.
- Admin console for dashboard, products, drafts, categories, statistics, and site settings.
- Product editor with tabs for base info, localized content, platforms, media, changelog, documents, policies, and SEO.
- Local upload adapter for images and download packages, with MIME, extension, size, filename, and path traversal checks.
- Download API that records download events before redirecting to an internal file or external URL.
- PostgreSQL schema managed by Drizzle ORM.
- Docker Compose stack for the app, PostgreSQL, Umami, and Caddy.

## Tech Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS and local UI components
- PostgreSQL and Drizzle ORM
- Cookie-based admin sessions with hashed passwords
- Local filesystem storage, with an OSS adapter interface reserved for future use
- Umami analytics
- Docker Compose and Caddy

## Project Structure

```text
app/                  Next.js routes, admin pages, public pages, and APIs
components/           Frontend and UI components
lib/                  Database, auth, storage, markdown, settings, and product helpers
drizzle/              SQL migrations
scripts/              Migration, seed, and admin initialization scripts
docker/               PostgreSQL initialization scripts
public/               Local demo media and public assets
```

## Requirements

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+ for local development, or Docker Desktop for the Compose stack

## Environment

Copy the example file before starting:

```bash
cp .env.example .env
```

Important variables:

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

Set a real `SESSION_SECRET` and either `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH` before production deployment.

## Local Development

Install dependencies:

```bash
corepack enable
pnpm install
```

Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

Run database setup:

```bash
pnpm db:migrate
pnpm db:seed
pnpm admin:init
```

Start the development server:

```bash
pnpm dev
```

Open:

- Public site: `http://127.0.0.1:3000/zh`
- Admin login: `http://127.0.0.1:3000/admin/login`

Default seeded admin:

- Email: `admin@example.com`
- Password: `change_me_admin_password`

Change the password before using the project outside local development.

## Scripts

```bash
pnpm dev          # Start Next.js in development mode
pnpm build        # Build the production app
pnpm start        # Start the production server
pnpm typecheck    # Run TypeScript checks
pnpm lint         # Run ESLint
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Apply database migrations
pnpm db:seed      # Seed demo categories, products, media, documents, and changelogs
pnpm admin:init   # Create or update the admin account from env values
```

## Docker Deployment

Copy and edit environment values:

```bash
cp .env.example .env
```

Start the stack:

```bash
docker compose up -d --build
```

Initialize the database:

```bash
docker compose exec app pnpm db:migrate
docker compose exec app pnpm db:seed
docker compose exec app pnpm admin:init
```

The Compose stack includes:

- `app`: Next.js public site, admin console, and API routes
- `postgres`: business database and Umami database
- `umami`: self-hosted analytics
- `caddy`: HTTPS reverse proxy for `apps.aameel.top`, `/stats/*`, and `/uploads/*`

Persistent data:

- PostgreSQL data is stored in the `postgres_data` volume.
- Uploaded files are stored in the `uploads` volume.
- Caddy state is stored in `caddy_data` and `caddy_config`.

## Storage

The first version implements the local storage adapter:

- Images are written to `UPLOAD_DIR/images`.
- Download packages are written to `UPLOAD_DIR/downloads`.
- Public URLs are generated from `PUBLIC_UPLOAD_BASE_URL`.

The OSS adapter interface is present but intentionally left as a TODO.

Default upload limits:

- Images: 10 MB
- Download packages: 300 MB

These can be changed with `IMAGE_MAX_BYTES` and `DOWNLOAD_MAX_BYTES`.

## Routes

Public:

- `/`
- `/zh`
- `/en`
- `/[locale]/apps/[slug]`
- `/[locale]/apps/[slug]/help`
- `/[locale]/apps/[slug]/privacy`
- `/[locale]/apps/[slug]/terms`

Admin:

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/drafts`
- `/admin/categories`
- `/admin/stats`
- `/admin/settings`

APIs:

- `/api/admin/auth/login`
- `/api/admin/auth/logout`
- `/api/admin/products`
- `/api/admin/products/[id]`
- `/api/admin/categories`
- `/api/admin/settings`
- `/api/admin/upload`
- `/api/download?platformId=...&locale=zh`

## Validation

Run these before deploying:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Manual checks worth covering:

- Admin login and logout
- Create draft, publish, hide, and delete restrictions
- Upload image and download package
- Public product visibility for published, hidden, draft, and deleted products
- `/zh` and `/en` language switching
- Product detail downloads and download event recording
- Docker restart persistence for PostgreSQL and uploads

## Security Notes

- Admin pages and `/api/admin/*` routes validate sessions on the server.
- Passwords are stored as bcrypt hashes.
- Session cookies are HttpOnly, SameSite, and Secure in production.
- Markdown is sanitized before rendering.
- Uploads are checked by type, extension, size, filename, and final path.
- Published products cannot be deleted directly; they must be hidden first.
- Replace every default secret before production deployment.
