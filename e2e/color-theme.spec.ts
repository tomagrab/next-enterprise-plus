import { test, expect } from "@playwright/test";

test.describe("Color Theme System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/color-theme");
  });

  test("displays color theme page correctly", async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    await expect(
      layoutContainer
        .getByRole("heading", { name: "🎨 Color Theme System" })
        .first()
    ).toBeVisible();

    await expect(
      layoutContainer
        .getByText("Explore the dynamic color theme system")
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows all color theme options", async ({ page }) => {
    // Check all theme buttons are present
    await expect(page.getByRole("button", { name: /blue/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /red/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /rose/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /orange/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /green/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /violet/i })).toBeVisible();
  });

  test("changes color theme when clicked", async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState("load");

    // Get viewport to determine mobile vs desktop
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors for mobile vs desktop
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Wait for color theme buttons to be available in the correct layout
    await expect(
      layoutContainer.getByRole("button", { name: /red/i }).first()
    ).toBeVisible({ timeout: 10000 });

    // Click on red theme
    await layoutContainer.getByRole("button", { name: /red/i }).first().click();

    // Wait for theme change to be applied
    await page.waitForSelector("html.theme-red", { timeout: 5000 });

    // Check that the theme class is applied to html element
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/theme-red/);

    // Check that primary color elements change
    const primaryButton = page
      .getByRole("button", { name: "Primary Button" })
      .first();
    await expect(primaryButton).toBeVisible();

    // Switch to green theme
    await page.getByRole("button", { name: /green/i }).first().click();

    // Wait for green theme to be applied and red theme to be removed
    await page.waitForSelector("html.theme-green:not(.theme-red)", {
      timeout: 5000,
    });

    await expect(htmlElement).toHaveClass(/theme-green/);
    await expect(htmlElement).not.toHaveClass(/theme-red/);
  });
  test("persists theme choice across page reloads", async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState("load");

    // Get viewport to determine mobile vs desktop
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors for mobile vs desktop
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Wait for color theme buttons to be available in the correct layout
    await expect(
      layoutContainer.getByRole("button", { name: /orange/i }).first()
    ).toBeVisible({ timeout: 10000 });

    // Set orange theme
    await layoutContainer
      .getByRole("button", { name: /orange/i })
      .first()
      .click();

    // Wait for theme to be applied to HTML element
    const htmlElement = page.locator("html");
    await page.waitForSelector("html.theme-orange", { timeout: 5000 });
    await expect(htmlElement).toHaveClass(/theme-orange/);

    // Reload page
    await page.reload();

    // Wait for page to load and providers to initialize
    await page.waitForLoadState("load");
    await expect(
      page.getByRole("heading", { name: "🎨 Color Theme System" })
    ).toBeVisible();

    // Wait for color theme provider to restore from localStorage by checking the actual theme class
    await page.waitForSelector("html.theme-orange", { timeout: 10000 });

    // Check theme is still applied after reload
    await expect(htmlElement).toHaveClass(/theme-orange/);
  });

  test("works with light/dark mode toggle", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);

    // Switch to dark mode using the dropdown
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await page.waitForTimeout(200);

    // Check dark mode is applied
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // Change color theme while in dark mode
    await page
      .getByRole("button", { name: /violet/i })
      .first()
      .click();
    await page.waitForTimeout(200);

    // Both classes should be present
    await expect(htmlElement).toHaveClass(/dark/);
    await expect(htmlElement).toHaveClass(/theme-violet/);

    // Switch back to light mode
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("menuitem", { name: "Light" }).click();
    await page.waitForTimeout(200);

    // Should keep color theme but remove dark mode
    await expect(htmlElement).not.toHaveClass(/dark/);
    await expect(htmlElement).toHaveClass(/theme-violet/);
  });
  test("interactive demo components work", async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Wait for demo content to be visible within the correct layout
    await expect(
      layoutContainer.getByText("Component Showcase").first()
    ).toBeVisible({
      timeout: 10000,
    });

    // Test input field - use specific ID to avoid ambiguity
    const input = layoutContainer.locator("#demo-input").first();
    await expect(input).toBeVisible({ timeout: 5000 });

    // Clear existing value and type new one
    await input.clear();
    await input.fill("Test input");
    await expect(input).toHaveValue("Test input");

    // Test toggle switch - use specific ID and wait for state change
    const toggle = layoutContainer.locator("#demo-switch").first();
    await expect(toggle).toBeVisible({ timeout: 5000 });

    // Check initial state and click
    const initialState = await toggle.getAttribute("aria-checked");
    await toggle.click();

    // Wait a moment for the state to update
    await page.waitForTimeout(100);

    // Check if the state has changed
    const newState = await toggle.getAttribute("aria-checked");
    expect(newState).not.toBe(initialState);

    // If it was false initially, it should now be true
    if (initialState === "false") {
      await expect(toggle).toBeChecked();
    }

    // Test slider (basic interaction)
    const slider = layoutContainer.getByRole("slider").first();
    await expect(slider).toBeVisible({ timeout: 5000 });
  });

  test("shows current theme information", async ({ page }) => {
    await page.waitForTimeout(500);

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    await expect(
      layoutContainer.getByText("Technical Details").first()
    ).toBeVisible({
      timeout: 10000,
    });
    await expect(
      layoutContainer.getByText("Current Color Theme:").first()
    ).toBeVisible({
      timeout: 5000,
    });
    await expect(
      layoutContainer.getByText("Current Mode:").first()
    ).toBeVisible({
      timeout: 5000,
    });

    // Change theme and verify info updates
    await layoutContainer
      .getByRole("button", { name: /rose/i })
      .first()
      .click();
    await page.waitForTimeout(200);

    // Wait for theme to be applied
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/theme-rose/);
  });
  test("navigation works correctly", async ({ page }) => {
    // Test navigation based on viewport
    await page.goto("/");
    await page.waitForTimeout(500);

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // Mobile navigation - look for the more button
      const moreButton = page.locator('[data-component="mobile-more-button"]');
      const moreButtonVisible = await moreButton.isVisible();

      if (moreButtonVisible) {
        await moreButton.click();

        // Wait for sheet to open
        await page.waitForSelector('[role="dialog"]', {
          state: "visible",
          timeout: 5000,
        });

        // Wait for and click the Color Themes link
        await page.getByRole("link", { name: /color theme/i }).click();
      }
    } else {
      // Desktop navigation - use sidebar link (not button)
      // Look for Color Themes in the sidebar - use .first() to avoid duplication
      await page.getByRole("link", { name: "Color Themes" }).first().click();
    }

    await expect(page).toHaveURL("/color-theme");

    // Check page loads correctly
    await expect(
      page.getByRole("heading", { name: "🎨 Color Theme System" })
    ).toBeVisible();
  });

  test("mobile responsive design", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for the page to adapt to mobile
    await page.waitForTimeout(1000);

    // Color theme buttons should be responsive and visible in mobile layout
    const themeButtons = page.getByRole("button", {
      name: /blue|red|rose|orange|green|violet/i,
    });

    // Check that theme buttons are visible on mobile
    await expect(themeButtons.first()).toBeVisible();

    // On mobile, the content might be in a different layout or collapsed
    // Just check that essential color theme functionality works

    // Test theme switching on mobile
    await page.getByRole("button", { name: /red/i }).first().click();
    await page.waitForTimeout(200);

    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/theme-red/);

    // Switch to another theme
    await page.getByRole("button", { name: /green/i }).first().click();
    await page.waitForTimeout(200);

    await expect(htmlElement).toHaveClass(/theme-green/);
    await expect(htmlElement).not.toHaveClass(/theme-red/);

    // Check that the page heading is still visible on mobile
    await expect(
      page.getByRole("heading", { name: "🎨 Color Theme System" })
    ).toBeVisible();
  });

  test("accessibility features", async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Check for proper ARIA labels and roles
    const colorButtons = layoutContainer.getByRole("button", {
      name: /blue|red|rose|orange|green|violet/i,
    });
    await expect(colorButtons.first()).toBeVisible();

    // Check that form elements have proper labels - use IDs to be specific
    await expect(
      layoutContainer.getByText("Component Showcase").first()
    ).toBeVisible({
      timeout: 10000,
    });

    const input = layoutContainer.locator("#demo-input").first();
    await expect(input).toBeVisible({ timeout: 5000 });

    const toggle = layoutContainer.locator("#demo-switch").first();
    await expect(toggle).toBeVisible({ timeout: 5000 });

    // Check that buttons have accessible text
    await expect(
      page.getByRole("button", { name: "Primary Button" }).first()
    ).toBeVisible({ timeout: 5000 });
  });
});
