import { db } from "../db";
import { users, accounts, sessions } from "../db/schema";

async function main() {
  const userCount = await db.select().from(users);
  const accountCount = await db.select().from(accounts);
  const sessionCount = await db.select().from(sessions);
  
  console.log(`Users: ${userCount.length}`);
  console.log(`Accounts: ${accountCount.length}`);
  console.log(`Sessions: ${sessionCount.length}`);
  
  if (userCount.length > 0) {
    console.log("\nExisting users:", userCount.map(u => ({ id: u.id, email: u.email })));
  }
}

main().then(() => process.exit(0));
