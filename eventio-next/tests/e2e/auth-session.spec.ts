import { expect, test, type Page } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

type E2ECredentials = { email: string; password: string };

loadEnvConfig(process.cwd());

function resolveCredentials(): E2ECredentials {
  return {
    email: process.env.E2E_AUTH_EMAIL ?? "",
    password: process.env.E2E_AUTH_PASSWORD ?? "",
  };
}

async function loginViaUI(page: Page, creds: E2ECredentials) {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await page.getByLabel("Email").fill(creds.email);
  await page.getByRole("textbox", { name: /Password/i }).fill(creds.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
}

test.describe("auth and session routing", () => {
  const creds = resolveCredentials();
  const hasAuthCreds = Boolean(creds.email && creds.password);

  test("redirects unauthenticated user from protected route to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login\?redirectTo=(%2F|\/)dashboard/);
    await expect(
      page.getByRole("heading", { name: "Sign in to Eventio." }),
    ).toBeVisible();
  });

  test("logs in successfully and reaches dashboard", async ({ page }) => {
    test.skip(
      !hasAuthCreds,
      "Set E2E_AUTH_EMAIL and E2E_AUTH_PASSWORD to run authenticated login test.",
    );
    await loginViaUI(page, creds);
  });

  test("redirects authenticated user away from login page", async ({ page }) => {
    test.skip(
      !hasAuthCreds,
      "Set E2E_AUTH_EMAIL and E2E_AUTH_PASSWORD to run authenticated redirect test.",
    );
    await loginViaUI(page, creds);
    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
