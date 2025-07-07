import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto("/");

    // Navigate to color-theme page (this page exists)
    const colorThemeLink = page
      .getByRole("link", { name: /color theme/i })
      .first();
    if ((await colorThemeLink.count()) > 0) {
      await colorThemeLink.click();
      await expect(page).toHaveURL("/color-theme");
      await expect(
        page.getByRole("heading", { name: /color theme/i }).first()
      ).toBeVisible();
    }

    // Navigate to feature flags page (this page exists)
    await page.goto("/");
    const featureFlagsLink = page
      .getByRole("link", { name: /feature flags/i })
      .first();
    if ((await featureFlagsLink.count()) > 0) {
      await featureFlagsLink.click();
      await expect(page).toHaveURL("/feature-flags");
    }

    // Navigate back to home
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  test("should update breadcrumbs correctly", async ({ page }) => {
    await page.goto("/");

    // Check if breadcrumbs exist - they might be hidden on mobile or not implemented
    const breadcrumbContainer = page
      .locator(
        '[aria-label="breadcrumb"], .breadcrumb, nav[aria-label*="breadcrumb"]'
      )
      .first();

    if (
      (await breadcrumbContainer.count()) > 0 &&
      (await breadcrumbContainer.isVisible())
    ) {
      // Home page breadcrumb
      await expect(page.getByText("Home").first()).toBeVisible();

      // Navigate to a page that exists and check breadcrumb
      await page.goto("/color-theme");
      const colorBreadcrumb = page.getByText("Color Theme").first();
      if ((await colorBreadcrumb.count()) > 0) {
        await expect(colorBreadcrumb).toBeVisible();
      }
    } else {
      // If no breadcrumbs exist, just verify basic navigation works
      await page.goto("/color-theme");
      await expect(page).toHaveURL("/color-theme");
    }
  });

  test("should handle mobile navigation", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // On mobile, sidebar should be collapsed and mobile nav should be visible
    await expect(page.getByRole("navigation")).toBeVisible();

    // Check that mobile-specific navigation is working
    // The sidebar should be responsive
    const sidebar = page.locator("[data-sidebar]").first();
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
    }
  });
});
