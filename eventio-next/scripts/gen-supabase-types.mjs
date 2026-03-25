import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error(
    "Missing SUPABASE_PROJECT_ID. Example:\n  SUPABASE_PROJECT_ID=abcdefghijklmnopqrst npm run db:types",
  );
  process.exit(1);
}

const outPath = resolve("src/types/database.ts");
mkdirSync(dirname(outPath), { recursive: true });

const args = [
  "--yes",
  "supabase",
  "gen",
  "types",
  "typescript",
  "--project-id",
  projectId,
  "--schema",
  "public",
];

const stdout =
  process.platform === "win32"
    ? execFileSync("cmd", ["/c", ["npx", ...args].join(" ")], { encoding: "utf8" })
    : execFileSync("npx", args, { encoding: "utf8" });

writeFileSync(outPath, stdout, "utf8");

