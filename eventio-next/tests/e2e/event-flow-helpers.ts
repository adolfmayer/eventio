import { expect, type Page } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export type E2ECredentials = {
  email: string;
  password: string;
};

export function resolveOwnerCredentials(): E2ECredentials {
  return {
    email: process.env.E2E_OWNER_EMAIL ?? process.env.E2E_AUTH_EMAIL ?? "",
    password: process.env.E2E_OWNER_PASSWORD ?? process.env.E2E_AUTH_PASSWORD ?? "",
  };
}

export function resolveAttendeeCredentials(): E2ECredentials {
  return {
    email: process.env.E2E_ATTENDEE_EMAIL ?? "",
    password: process.env.E2E_ATTENDEE_PASSWORD ?? "",
  };
}

export function hasCredentials(creds: E2ECredentials): boolean {
  return Boolean(creds.email && creds.password);
}

export async function loginViaUI(page: Page, creds: E2ECredentials) {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await page.getByLabel("Email").fill(creds.email);
  await page.getByRole("textbox", { name: /Password/i }).fill(creds.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
}

export async function logoutViaUI(page: Page) {
  await page.goto("/dashboard");
  await page.locator('button[aria-haspopup="menu"]').first().click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
}

function futureDate(daysAhead: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + daysAhead);
  return dt.toISOString().slice(0, 10);
}

export function createEventPayload(prefix: string) {
  const stamp = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    title: `${prefix} ${stamp}`,
    description: `E2E event ${stamp}`,
    date: futureDate(10),
    time: "19:30",
    location: "Warsaw",
    capacity: "25",
  } as const;
}

export async function createEventThroughUI(
  page: Page,
  payload: ReturnType<typeof createEventPayload>,
) {
  await page.goto("/create-new");
  await expect(page.getByRole("heading", { name: "Create new event" })).toBeVisible();
  await page.getByLabel("Title").fill(payload.title);
  await page.getByLabel("Description").fill(payload.description);
  await page.getByLabel("Date").fill(payload.date);
  await page.getByLabel("Time").fill(payload.time);
  await page.getByLabel("Location").fill(payload.location);
  await page.getByLabel("Capacity").fill(payload.capacity);
  await page.getByRole("button", { name: /create new event/i }).click();

  await expect(page).toHaveURL(/\/dashboard-detail\?id=/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: payload.title })).toBeVisible();

  const current = new URL(page.url());
  const eventId = current.searchParams.get("id");
  if (!eventId) {
    throw new Error("Missing event id after create flow.");
  }
  return eventId;
}

