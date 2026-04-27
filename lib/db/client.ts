import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://meel_apps_user:password@localhost:5432/meel_apps";

declare global {
  var meelAppsSql: postgres.Sql | undefined;
}

const sql =
  globalThis.meelAppsSql ??
  postgres(databaseUrl, {
    max: Number(process.env.DB_POOL_MAX ?? 5),
    idle_timeout: 20,
    prepare: false
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.meelAppsSql = sql;
}

export const db = drizzle(sql, { schema });
export { sql };
