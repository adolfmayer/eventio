import { clearPreviousSeedData, listAllSeedAuthUsers, SEED_DOMAIN } from "./seed-core";

async function main() {
  console.log("Starting seed cleanup...");

  const seedUsers = await listAllSeedAuthUsers();
  await clearPreviousSeedData(seedUsers.map((user) => user.id));

  console.log("Seed cleanup complete.");
  console.log(
    JSON.stringify(
      {
        deleted_seed_users: seedUsers.length,
        seed_user_domain: SEED_DOMAIN,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  console.error("Seed cleanup failed:", error);
  process.exit(1);
});
