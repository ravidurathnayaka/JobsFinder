import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/JobsFinder/i);
  });

  test("should display job listings", async ({ page }) => {
    await page.goto("/");
    // Add more specific assertions based on your UI
    await expect(page.locator("body")).toBeVisible();
  });
});
