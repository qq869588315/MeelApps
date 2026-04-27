#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
DO
\$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'meel_apps_user') THEN
    CREATE ROLE meel_apps_user LOGIN PASSWORD '${MEEL_APPS_DB_PASSWORD:-password}';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'umami_user') THEN
    CREATE ROLE umami_user LOGIN PASSWORD '${UMAMI_DB_PASSWORD:-password}';
  END IF;
END
\$\$;

CREATE DATABASE meel_apps OWNER meel_apps_user;
CREATE DATABASE umami OWNER umami_user;
EOSQL
