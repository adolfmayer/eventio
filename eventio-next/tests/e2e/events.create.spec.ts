import { expect, test } from "@playwright/test";

import {
  createEventPayload,
  createEventThroughUI,
  hasCredentials,
  loginViaUI,
  resolveOwnerCredentials,
} from "./event-flow-helpers";

test.describe("events create flow", () => {
  const ownerCreds = resolveOwnerCredentials();

  test("owner can create a new event", async ({ page }) => {
    test.skip(
      !hasCredentials(ownerCreds),
      "Set E2E_OWNER_EMAIL/E2E_OWNER_PASSWORD (or E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD).",
    );

    await loginViaUI(page, ownerCreds);
    const payload = createEventPayload("E2E Create");
    const eventId = await createEventThroughUI(page, payload);

    await expect(page).toHaveURL(new RegExp(`/dashboard-detail\\?id=${eventId}`));
    await expect(page.getByText(payload.description)).toBeVisible();
  });
});

