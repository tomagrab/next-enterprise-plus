import { test, expect } from "@playwright/test";

test.describe("Feature Flags System", () => {
  test("should render feature flags demo page", async ({ page }) => {
    await page.goto("/feature-flags");

    // Check page title - target the main title specifically by name
    await expect(
      page.getByRole("heading", { name: /Feature Flags Demo/i })
    ).toBeVisible();

    // Check that we're on the correct page by verifying URL
    await expect(page).toHaveURL("/feature-flags");
  });

  test("should display demo sections", async ({ page }) => {
    await page.goto("/feature-flags");

    // Check for basic demo sections - use role-based selectors to avoid duplicates
    await expect(
      page.getByRole("heading", { name: /Live Demo/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Debug Panel/i })
    ).toBeVisible();
  });

  test("should show configuration guide", async ({ page }) => {
    await page.goto("/feature-flags");

    // Check configuration guide
    await expect(
      page.getByRole("heading", { name: /Configuration Guide/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Environment Variables" })
    ).toBeVisible();
  });

  test("should display code examples", async ({ page }) => {
    await page.goto("/feature-flags");

    // Check code examples
    await expect(
      page.getByRole("heading", { name: /Code Examples/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Basic Usage" })
    ).toBeVisible();
  });

  test("should be accessible from sidebar navigation", async ({ page }) => {
    await page.goto("/");

    // Use viewport width to determine if we're on desktop or mobile
    const viewportSize = page.viewportSize();
    const isDesktop = viewportSize && viewportSize.width >= 768; // md breakpoint

    if (isDesktop) {
      // Desktop: Look for sidebar trigger and Feature Flags link
      const sidebarTrigger = page.locator('[data-sidebar="trigger"]');
      if (await sidebarTrigger.isVisible()) {
        await sidebarTrigger.click();
        await page.waitForTimeout(500);
      }

      const featureFlagsLink = page.getByRole("link", {
        name: /Feature Flags/i,
      });
      await expect(featureFlagsLink).toBeVisible({ timeout: 10000 });
      await featureFlagsLink.click();
    } else {
      // Mobile: Navigate directly to feature flags page since mobile nav doesn't have Feature Flags link
      await page.goto("/feature-flags");
    }

    // Should be on feature flags page
    await expect(page).toHaveURL("/feature-flags");
  });

  test("should show responsive design", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/feature-flags");
    await expect(
      page.getByRole("heading", { name: /Feature Flags Demo/i })
    ).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/feature-flags");
    await expect(
      page.getByRole("heading", { name: /Feature Flags Demo/i })
    ).toBeVisible();
  });
});
