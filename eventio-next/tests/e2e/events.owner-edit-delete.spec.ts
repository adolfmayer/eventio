import { expect, test } from "@playwright/test";

import {
  createEventPayload,
  createEventThroughUI,
  hasCredentials,
  loginViaUI,
  resolveOwnerCredentials,
} from "./event-flow-helpers";

test.describe("events owner edit delete flow", () => {
  const ownerCreds = resolveOwnerCredentials();

  test("owner can edit and delete an event", async ({ page }) => {
    test.skip(
      !hasCredentials(ownerCreds),
      "Set E2E_OWNER_EMAIL/E2E_OWNER_PASSWORD (or E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD).",
    );

    await loginViaUI(page, ownerCreds);
    const payload = createEventPayload("E2E OwnerEditDelete");
    const eventId = await createEventThroughUI(page, payload);

    const editedTitle = `${payload.title} (edited)`;
    await page.goto(`/dashboard-detail-edit?id=${encodeURIComponent(eventId)}`);
    await expect(page.getByRole("textbox", { name: "Title" })).toBeVisible();
    await page.getByRole("textbox", { name: "Title" }).fill(editedTitle);
    await page.getByRole("button", { name: "Confirm event changes" }).click();

    await expect(page).toHaveURL(
      new RegExp(`/dashboard-detail\\?id=${eventId}`),
      { timeout: 15_000 },
    );
    await expect(page.getByRole("heading", { name: editedTitle })).toBeVisible();

    await page.goto(`/dashboard-detail-edit?id=${encodeURIComponent(eventId)}`);
    await page.getByRole("button", { name: /delete event/i }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });
});

