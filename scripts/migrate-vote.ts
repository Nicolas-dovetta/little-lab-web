import { readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { splitSqlStatements } from "../src/lib/vote";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const sql = neon(url);
  const file = join(process.cwd(), "scripts/migrate-vote.sql");
  const statements = splitSqlStatements(readFileSync(file, "utf8"));
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`Vote migration OK (${statements.length} statements).`);
}

const isDirect = process.argv[1]?.includes("migrate-vote");
if (isDirect) {
  main().catch((err) => {
    console.error("Vote migration failed:", err instanceof Error ? err.message : "error");
    process.exit(1);
  });
}
