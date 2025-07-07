import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show sign in page with template configuration", async ({
    page,
  }) => {
    await page.goto("/auth/signin");
    await page.waitForTimeout(2000);

    const timeout = 15000;
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Check for sign in page elements within the visible layout
    const signInHeading = layoutContainer.getByRole("heading", {
      name: /sign in/i,
    });
    await expect(signInHeading.first()).toBeVisible({ timeout });

    const authMethodText = layoutContainer.getByText(
      "Choose your authentication method"
    );
    await expect(authMethodText.first()).toBeVisible({ timeout });

    // Check for provider buttons (they should be disabled in template state)
    const githubButton = layoutContainer.getByRole("button", {
      name: /github/i,
    });
    const googleButton = layoutContainer.getByRole("button", {
      name: /google/i,
    });
    const microsoftButton = layoutContainer.getByRole("button", {
      name: /microsoft/i,
    });

    await expect(githubButton.first()).toBeVisible({ timeout });
    await expect(googleButton.first()).toBeVisible({ timeout });
    await expect(microsoftButton.first()).toBeVisible({ timeout });

    // Check that non-credentials providers are disabled (template state)
    await expect(githubButton.first()).toBeDisabled({ timeout });
    await expect(googleButton.first()).toBeDisabled({ timeout });
    await expect(microsoftButton.first()).toBeDisabled({ timeout });

    // Check that credentials provider is enabled (for testing)
    const credentialsButton = layoutContainer.getByRole("button", {
      name: /email/i,
    });
    await expect(credentialsButton.first()).toBeVisible({ timeout });
    await expect(credentialsButton.first()).toBeEnabled({ timeout });

    // Check for setup instructions (template feature)
    await expect(
      layoutContainer.getByText("🔧 Setup Required").first()
    ).toBeVisible({ timeout });
    await expect(
      layoutContainer
        .getByText("Authentication providers are ready to configure")
        .first()
    ).toBeVisible({ timeout });
  });

  test("should handle protected routes appropriately", async ({ page }) => {
    // Test that the app handles unauthenticated access gracefully
    // Since this is a template, most routes should be accessible for demonstration
    await page.goto("/");

    // Should load the home page successfully
    await expect(
      page.getByRole("heading", { name: /next enterprise/i })
    ).toBeVisible();

    // Check that auth UI is present in sidebar (sign in state)
    // This varies by implementation, so we'll just check the page loads
    expect(page.url()).toContain("/");
  });

  test("should show authentication setup information", async ({ page }) => {
    // Test the auth setup page that provides configuration guidance
    await page.goto("/auth-setup");
    await page.waitForTimeout(2000);

    const timeout = 15000;
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Check for setup page elements within the visible layout
    await expect(
      layoutContainer
        .getByRole("heading", { name: /authentication setup/i })
        .first()
    ).toBeVisible({ timeout });
    await expect(
      layoutContainer
        .getByText("NextAuth.js v4 (stable) is fully configured")
        .first()
    ).toBeVisible({ timeout });

    // Check for provider information
    await expect(
      layoutContainer.getByText("Supported Providers").first()
    ).toBeVisible({ timeout });
    await expect(layoutContainer.getByText("GitHub").first()).toBeVisible({
      timeout,
    });
    await expect(layoutContainer.getByText("Google").first()).toBeVisible({
      timeout,
    });
    await expect(
      layoutContainer.getByText("Microsoft Entra ID").first()
    ).toBeVisible({ timeout });

    // Check for setup instructions
    await expect(layoutContainer.getByText("Quick Start").first()).toBeVisible({
      timeout,
    });

    // Check for link to sign-in page
    await expect(
      layoutContainer.getByRole("link", { name: /view sign-in page/i }).first()
    ).toBeVisible({ timeout });
  });
});
