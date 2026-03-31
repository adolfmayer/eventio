import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home route renders", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Eventio Static V1" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Log In" })).toBeVisible();
  });

  test("login route renders", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Sign in to Eventio." }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
