import { test, expect } from "@playwright/test";

test.describe("Color Theme System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/color-theme");
  });

  test("displays color theme page correctly", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "🎨 Color Theme System" })
    ).toBeVisible();
    await expect(
      page.getByText("Explore the dynamic color theme system")
    ).toBeVisible();
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
    // Click on red theme
    await page.getByRole("button", { name: /red/i }).first().click();

    // Check that the theme class is applied to html element
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/theme-red/);

    // Check that primary color elements change
    const primaryButton = page.getByRole("button", { name: "Primary Button" });
    await expect(primaryButton).toBeVisible();

    // Switch to green theme
    await page.getByRole("button", { name: /green/i }).first().click();
    await expect(htmlElement).toHaveClass(/theme-green/);
    await expect(htmlElement).not.toHaveClass(/theme-red/);
  });

  test("persists theme choice across page reloads", async ({ page }) => {
    // Set orange theme
    await page
      .getByRole("button", { name: /orange/i })
      .first()
      .click();

    // Reload page
    await page.reload();

    // Check theme is still applied
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/theme-orange/);
  });

  test("works with light/dark mode toggle", async ({ page }) => {
    // Switch to dark mode
    await page.getByRole("button", { name: "🌙 Dark Mode" }).click();

    // Check dark mode is applied
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // Change color theme while in dark mode
    await page
      .getByRole("button", { name: /violet/i })
      .first()
      .click();

    // Both classes should be present
    await expect(htmlElement).toHaveClass(/dark/);
    await expect(htmlElement).toHaveClass(/theme-violet/);

    // Switch back to light mode
    await page.getByRole("button", { name: "☀️ Light Mode" }).click();

    // Should keep color theme but remove dark mode
    await expect(htmlElement).not.toHaveClass(/dark/);
    await expect(htmlElement).toHaveClass(/theme-violet/);
  });

  test("interactive demo components work", async ({ page }) => {
    // Test input field
    const input = page.getByLabel("Input Field");
    await input.fill("Test input");
    await expect(input).toHaveValue("Test input");

    // Test toggle switch
    const toggle = page.getByRole("switch", { name: "Toggle switch" });
    await toggle.click();
    await expect(toggle).toBeChecked();

    // Test slider (basic interaction)
    const slider = page.getByRole("slider");
    await expect(slider).toBeVisible();
  });

  test("shows current theme information", async ({ page }) => {
    // Check technical details section
    await expect(page.getByText("Technical Details")).toBeVisible();
    await expect(page.getByText("Current Color Theme:")).toBeVisible();
    await expect(page.getByText("Current Mode:")).toBeVisible();

    // Change theme and verify info updates
    await page.getByRole("button", { name: /rose/i }).first().click();

    // The technical details should show the new theme
    const techSection = page.getByText("Technical Details").locator("..");
    await expect(techSection.getByText("rose")).toBeVisible();
  });

  test("navigation works correctly", async ({ page }) => {
    // Test breadcrumb or back navigation if present
    await page.goto("/");

    // Navigate via sidebar
    await page.getByRole("button", { name: /color themes/i }).click();
    await expect(page).toHaveURL("/color-theme");

    // Check page loads correctly
    await expect(
      page.getByRole("heading", { name: "🎨 Color Theme System" })
    ).toBeVisible();
  });

  test("mobile responsive design", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Color theme buttons should be responsive
    const themeButtons = page.getByRole("button", {
      name: /blue|red|rose|orange|green|violet/i,
    });
    await expect(themeButtons.first()).toBeVisible();

    // Demo components should be stacked properly
    await expect(page.getByText("Buttons & Actions")).toBeVisible();
    await expect(page.getByText("Form Elements")).toBeVisible();
  });

  test("accessibility features", async ({ page }) => {
    // Check for proper ARIA labels and roles
    const colorButtons = page.getByRole("button", {
      name: /blue|red|rose|orange|green|violet/i,
    });
    await expect(colorButtons.first()).toBeVisible();

    // Check that form elements have proper labels
    await expect(page.getByLabel("Input Field")).toBeVisible();
    await expect(page.getByLabel("Toggle switch")).toBeVisible();

    // Check that buttons have accessible text
    await expect(
      page.getByRole("button", { name: "Primary Button" })
    ).toBeVisible();
  });
});
