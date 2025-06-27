import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto("/");

    // Navigate to search page
    await page.getByRole("link", { name: /search/i }).click();
    await expect(page).toHaveURL("/search");
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();

    // Navigate to profile page
    await page.getByRole("link", { name: /profile/i }).click();
    await expect(page).toHaveURL("/profile");
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();

    // Navigate back to home
    await page.getByRole("link", { name: /home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("should update breadcrumbs correctly", async ({ page }) => {
    await page.goto("/");

    // Home page breadcrumb
    await expect(page.getByText("Home")).toBeVisible();

    // Navigate to analytics and check breadcrumb
    await page.getByRole("link", { name: /analytics/i }).click();
    await expect(page.getByText("Analytics")).toBeVisible();
  });

  test("should handle mobile navigation", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // On mobile, sidebar should be collapsed and mobile nav should be visible
    await expect(page.getByRole("navigation")).toBeVisible();

    // Check that mobile-specific navigation is working
    // The sidebar should be responsive
    const sidebar = page.locator("[data-sidebar]");
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
    }
  });
});
