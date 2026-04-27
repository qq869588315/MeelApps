import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@/lib/db/client";

async function ensureMigrationTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS __meel_migrations (
      id serial PRIMARY KEY,
      filename text NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

async function main() {
  await ensureMigrationTable();
  const migrationsDir = path.join(process.cwd(), "drizzle", "migrations");
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const [applied] = await sql<{ filename: string }[]>`
      SELECT filename FROM __meel_migrations WHERE filename = ${file}
    `;

    if (applied) {
      console.log(`Already applied ${file}`);
      continue;
    }

    const content = await readFile(path.join(migrationsDir, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(content);
      await tx`
        INSERT INTO __meel_migrations (filename) VALUES (${file})
      `;
    });
    console.log(`Applied ${file}`);
  }

  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 });
  process.exit(1);
});
