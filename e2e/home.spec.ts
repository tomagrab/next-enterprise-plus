import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load and display the main heading", async ({ page }) => {
    await page.goto("/");

    // Check for the main heading
    await expect(
      page.getByRole("heading", { name: /Next Enterprise Plus/i })
    ).toBeVisible();

    // Check for the logo
    await expect(page.getByAltText("Next.js logo")).toBeVisible();

    // Check for features section
    await expect(page.getByText("Template Features")).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");

    // Check that sidebar navigation is present
    await expect(page.getByRole("navigation")).toBeVisible();

    // Check for main navigation items
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /search/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /profile/i })).toBeVisible();
  });

  test("should show theme toggle", async ({ page }) => {
    await page.goto("/");

    // Theme toggle should be visible
    await expect(
      page.getByRole("button", { name: /toggle theme/i })
    ).toBeVisible();
  });

  test("should have working interactive demos", async ({ page }) => {
    await page.goto("/");

    // Overflow demo should be present
    await expect(page.getByText("Interactive Overflow Demo")).toBeVisible();

    // Error handling demo should be present
    await expect(page.getByText("Error Handling Testing")).toBeVisible();

    // Security demo should be present
    await expect(page.getByText("Security & Compliance Testing")).toBeVisible();
  });
});
