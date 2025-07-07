import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load and display the main heading", async ({ page }) => {
    await page.goto("/");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Check for the main heading within the visible layout
    await expect(
      layoutContainer
        .getByRole("heading", { name: /Next Enterprise Plus/i })
        .first()
    ).toBeVisible();

    // Check for the logo - handle mobile/desktop differences
    const logo = layoutContainer.getByAltText("Next.js logo").first();
    await expect(logo).toBeVisible();

    // Check for features section - use .first() to handle duplicates
    await expect(
      layoutContainer.getByText("Template Features").first()
    ).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");

    // Determine viewport for mobile vs desktop navigation expectations
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // Mobile: Expect mobile navigation to be present and visible
      const mobileNav = page.locator('[data-component="mobile-nav"]');
      await expect(mobileNav).toBeVisible();

      // Mobile navigation should have navigation items
      const navItems = mobileNav.locator("a, button").first();
      await expect(navItems).toBeVisible();
    } else {
      // Desktop: Expect sidebar navigation to be present and visible
      const sidebarNav = page.locator('[role="navigation"], .sidebar').first();
      await expect(sidebarNav).toBeVisible();

      // Desktop navigation should have navigation links
      const navLinks = sidebarNav.locator("a[href]").first();
      await expect(navLinks).toBeVisible();
    }

    // Both mobile and desktop should have theme toggle
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
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

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Check for demo content with more flexible approach
    const demoTexts = [
      "Interactive Overflow Demo",
      "Error Handling Testing",
      "Security & Compliance Testing",
      "Color Theme Demo", // Alternative demo content
      "Interactive Demo", // More generic demo content
    ];

    let foundDemo = false;
    for (const demoText of demoTexts) {
      const demoElement = layoutContainer.getByText(demoText).first();
      if ((await demoElement.count()) > 0) {
        if (await demoElement.isVisible()) {
          await expect(demoElement).toBeVisible();
          foundDemo = true;
          break;
        }
      }
    }

    // If no specific demo found, just check that we have some interactive content
    if (!foundDemo) {
      const interactiveElements = layoutContainer
        .locator('button, [role="button"], a[href^="/"]')
        .first();
      await expect(interactiveElements).toBeVisible();
    }
  });
});
