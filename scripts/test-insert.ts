import { db } from "../db";
import { users } from "../db/schema";

async function main() {
  try {
    const result = await db.insert(users).values({
      email: "debug-insert@test.com",
      name: "Debug Insert",
    }).returning();
    console.log("OK", result);
  } catch (err: any) {
    console.error("DB ERROR", err);
  }
}

main().then(() => process.exit(0));
