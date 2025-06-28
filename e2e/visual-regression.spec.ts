import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test("home page visual consistency", async ({ page }) => {
    await page.goto("/");

    // Wait for any loading states to complete
    await page.waitForLoadState("networkidle");

    // Take screenshot of full page
    await expect(page).toHaveScreenshot("home-page.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("color theme page visual consistency", async ({ page }) => {
    await page.goto("/color-theme");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("color-theme-page.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("color themes visual differences", async ({ page }) => {
    await page.goto("/color-theme");

    const themes = ["blue", "red", "rose", "orange", "green", "violet"];

    for (const theme of themes) {
      // Click theme button
      await page
        .getByRole("button", { name: new RegExp(theme, "i") })
        .first()
        .click();

      // Wait for theme to apply
      await page.waitForTimeout(500);

      // Screenshot the demo section
      const demoSection = page.getByText("Component Showcase").locator("..");
      await expect(demoSection).toHaveScreenshot(`theme-${theme}-demo.png`, {
        threshold: 0.3,
      });
    }
  });

  test("light and dark mode consistency", async ({ page }) => {
    await page.goto("/color-theme");

    // Light mode
    await page.getByRole("button", { name: "☀️ Light Mode" }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("light-mode.png", {
      fullPage: true,
      threshold: 0.2,
    });

    // Dark mode
    await page.getByRole("button", { name: "🌙 Dark Mode" }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("dark-mode.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("mobile responsive design", async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/color-theme");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("mobile-color-theme.png", {
      fullPage: true,
      threshold: 0.2,
    });

    // Test navigation on mobile
    await page.goto("/");
    await expect(page).toHaveScreenshot("mobile-home.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("sidebar states", async ({ page }) => {
    await page.goto("/");

    // Expanded sidebar
    await expect(page).toHaveScreenshot("sidebar-expanded.png", {
      threshold: 0.2,
    });

    // Collapsed sidebar (if collapsible)
    const sidebarTrigger = page.getByRole("button", {
      name: /toggle sidebar/i,
    });
    if (await sidebarTrigger.isVisible()) {
      await sidebarTrigger.click();
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot("sidebar-collapsed.png", {
        threshold: 0.2,
      });
    }
  });

  test("error states visual consistency", async ({ page }) => {
    await page.goto("/error-testing");
    await page.waitForLoadState("networkidle");

    // Test client error
    const clientErrorButton = page.getByRole("button", {
      name: /trigger client error/i,
    });
    if (await clientErrorButton.isVisible()) {
      await clientErrorButton.click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot("client-error-state.png", {
        threshold: 0.2,
      });
    }
  });

  test("form elements visual consistency", async ({ page }) => {
    await page.goto("/color-theme");

    // Focus on form elements section
    const formSection = page.getByText("Form Elements").locator("..");
    await expect(formSection).toHaveScreenshot("form-elements.png", {
      threshold: 0.2,
    });

    // Test form interactions
    await page.getByLabel("Input Field").fill("Test input");
    await page.getByRole("switch", { name: "Toggle switch" }).click();

    await expect(formSection).toHaveScreenshot("form-elements-filled.png", {
      threshold: 0.2,
    });
  });
});
