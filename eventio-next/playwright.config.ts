import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html"]] : [["list"], ["html"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
    // Next can treat headless bot UAs differently; force a standard Chrome UA.
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: false,
        timeout: 240_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
