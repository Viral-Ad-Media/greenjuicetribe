import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.");
}

// Neon's HTTP driver in production; plain node-postgres for a local Postgres during development.
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);

// Both drivers expose the same query API; type them as one so callers get a single type.
export const db = (
  isLocal ? drizzlePg(new Pool({ connectionString: url }), { schema }) : drizzleNeon(neon(url), { schema })
) as NeonHttpDatabase<typeof schema>;

export { schema };
