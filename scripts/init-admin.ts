import { eq } from "drizzle-orm";
import { db, sql } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").trim().toLowerCase();
  const passwordHash =
    process.env.ADMIN_PASSWORD_HASH ||
    (await hashPassword(process.env.ADMIN_PASSWORD || "change_me_admin_password"));

  const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (existing) {
    await db
      .update(admins)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(admins.id, existing.id));
    console.log(`Updated admin ${email}`);
  } else {
    await db.insert(admins).values({ email, passwordHash });
    console.log(`Created admin ${email}`);
  }

  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    console.warn("ADMIN_PASSWORD was not set; fallback password is change_me_admin_password.");
  }
  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 });
  process.exit(1);
});
