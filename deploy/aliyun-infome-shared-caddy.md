# Meel Apps 1.0 Alibaba Cloud Deployment

This guide deploys Meel Apps on the same Alibaba Cloud server as InfoMe without
binding host ports `80` or `443`. The existing InfoMe Caddy container remains
the only public gateway.

## Domains

Create DNS A records pointing to the server public IP:

- `apps.aameel.top`
- `backapps.aameel.top`

Only the Alibaba Cloud security group ports `22`, `80`, and `443` should be
public. Do not expose PostgreSQL.

## Files

Use these files for the shared-server deployment:

- `docker-compose.prod.yml`
- `.env.production.example`
- `deploy/caddy/apps-shared-gateway.Caddyfile`

Keep `docker-compose.yml` for standalone deployments where Apps owns its own
Caddy instance.

## Server Setup

```bash
mkdir -p /srv/apps
cd /srv/apps
git clone https://github.com/qq869588315/MeelApps.git .
cp .env.production.example .env
```

Edit `.env` and replace every `replace_with_*` value with a strong random
secret. Keep `ADMIN_PASSWORD` empty in `.env`; pass it only when running
`admin:init`.

Create or reuse the shared gateway network:

```bash
docker network create aameel_gateway || true
```

Connect the existing InfoMe Caddy container to the gateway network if it is not
already connected:

```bash
docker network connect aameel_gateway deploy-caddy-1 || true
```

Persist the `aameel_gateway` network in InfoMe's compose file later so the
connection survives a Caddy container recreation.

## Start Apps

```bash
cd /srv/apps
docker compose -f docker-compose.prod.yml -p apps build apps-web
docker compose -f docker-compose.prod.yml -p apps up -d apps-postgres
docker compose -f docker-compose.prod.yml -p apps run --rm apps-web pnpm db:migrate
docker compose -f docker-compose.prod.yml -p apps run --rm apps-web pnpm db:seed
docker compose -f docker-compose.prod.yml -p apps run --rm -e ADMIN_PASSWORD='<production-admin-password>' apps-web pnpm admin:init
docker compose -f docker-compose.prod.yml -p apps up -d
```

Do not run `db:seed` after the first production initialization, because it
resets products, categories, settings, sessions, and admins.

## Existing Caddy Gateway

Confirm the current InfoMe Caddy container and host-side Caddyfile path:

```bash
CADDY_CONTAINER=deploy-caddy-1
docker inspect "$CADDY_CONTAINER" \
  --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}'
```

Set the printed path as `CADDYFILE_HOST_PATH`, then back it up before editing:

```bash
CADDYFILE_HOST_PATH=/path/printed/by/docker-inspect
cp "$CADDYFILE_HOST_PATH" "$CADDYFILE_HOST_PATH.bak.$(date +%Y%m%d%H%M%S)"
```

Append the contents of `deploy/caddy/apps-shared-gateway.Caddyfile` to
`$CADDYFILE_HOST_PATH`. Do not remove the `infome.aameel.top` site block.

Validate and reload Caddy:

```bash
docker exec "$CADDY_CONTAINER" caddy validate --config /etc/caddy/Caddyfile
docker exec "$CADDY_CONTAINER" caddy reload --config /etc/caddy/Caddyfile
```

## Verification

```bash
curl -I https://infome.aameel.top
curl -I https://apps.aameel.top
curl -I https://apps.aameel.top/admin/login
curl -I https://backapps.aameel.top
docker compose -f docker-compose.prod.yml -p apps ps
```

Expected results:

- `https://infome.aameel.top` still works before and after Caddy reload.
- `https://apps.aameel.top` serves the public site.
- `https://apps.aameel.top/admin/login` returns `404`.
- `https://backapps.aameel.top` redirects to `/admin/login`.
- `apps-postgres` has no host port mapping.
