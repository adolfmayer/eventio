import { expect, test } from "@playwright/test";

import {
  createEventPayload,
  createEventThroughUI,
  hasCredentials,
  loginViaUI,
  logoutViaUI,
  resolveAttendeeCredentials,
  resolveOwnerCredentials,
} from "./event-flow-helpers";

test.describe("events join leave flow", () => {
  const ownerCreds = resolveOwnerCredentials();
  const attendeeCreds = resolveAttendeeCredentials();

  test("attendee can join and leave owner event", async ({ page }) => {
    test.skip(
      !hasCredentials(ownerCreds) || !hasCredentials(attendeeCreds),
      "Set owner and attendee E2E credentials for join/leave flow.",
    );

    await loginViaUI(page, ownerCreds);
    const payload = createEventPayload("E2E JoinLeave");
    const eventId = await createEventThroughUI(page, payload);

    await logoutViaUI(page);
    await loginViaUI(page, attendeeCreds);
    await page.goto(`/dashboard-detail?id=${encodeURIComponent(eventId)}`);
    await expect(page.getByRole("heading", { name: payload.title })).toBeVisible();

    await page.getByRole("button", { name: "Join" }).click();
    await expect(page.getByRole("button", { name: "Leave" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("You")).toBeVisible();

    await page.getByRole("button", { name: "Leave" }).click();
    await expect(page.getByRole("button", { name: "Join" })).toBeVisible({
      timeout: 15_000,
    });
  });
});

