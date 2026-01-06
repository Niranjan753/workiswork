import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL or POSTGRES_URL for database connection",
  );
}

const pool = new Pool({
  connectionString,
  max: 10,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });
export type DbClient = typeof db;


