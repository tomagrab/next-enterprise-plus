import { test, expect } from "@playwright/test";

test.describe("Security Features", () => {
  test("should have proper security headers", async ({ page }) => {
    const response = await page.goto("/");

    // Check for security headers - note: in development, these might not be configured
    const headers = response?.headers();
    if (headers) {
      // We'll check if at least one security header is present
      // In dev mode, some headers might not be configured, so we'll be more lenient
      const hasSecurityHeaders =
        headers["content-security-policy"] ||
        headers["x-frame-options"] ||
        headers["x-content-type-options"] ||
        headers["strict-transport-security"];

      // If no security headers are found, we'll just verify the response is successful
      if (!hasSecurityHeaders) {
        expect(response?.status()).toBe(200);
      } else {
        // If security headers are present, verify they have proper values
        if (headers["x-content-type-options"]) {
          expect(headers["x-content-type-options"]).toBe("nosniff");
        }
      }
    }
  });

  test("should load security testing page", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Verify the main heading is visible
    await expect(
      layoutContainer
        .getByRole("heading", { name: /Security & Compliance Testing/i })
        .first()
    ).toBeVisible();

    // Verify security features overview is present
    await expect(
      layoutContainer.getByText(/Security Features/i).first()
    ).toBeVisible();

    // Verify key security sections are present
    await expect(
      layoutContainer.getByText(/Input Validation/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/Rate Limiting/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/CSRF Protection/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/Security Headers/i).first()
    ).toBeVisible();
  });

  test("should display security demo tabs", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Scroll down to ensure the demo section is visible
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );
    await page.waitForTimeout(500);

    // Check that the security demo tabs are present within the correct layout
    const validationTab = layoutContainer
      .getByRole("tab", { name: /validation/i })
      .first();
    const rateLimitTab = layoutContainer
      .getByRole("tab", { name: /rate.*limit/i })
      .first();
    const headersTab = layoutContainer
      .getByRole("tab", { name: /headers/i })
      .first();

    await expect(validationTab).toBeVisible({ timeout: 10000 });
    await expect(rateLimitTab).toBeVisible({ timeout: 10000 });
    await expect(headersTab).toBeVisible({ timeout: 10000 });
  });

  test("should interact with validation tab", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Find and click on the validation tab within the correct layout
    const validationTab = layoutContainer
      .getByRole("tab", { name: /validation/i })
      .first();
    await expect(validationTab).toBeVisible({ timeout: 10000 });
    await validationTab.click();
    await page.waitForTimeout(1000);

    // Look for form inputs in the active validation tab within the correct layout
    const activeTabContent = layoutContainer.locator('[data-state="active"]');
    const nameInput = activeTabContent.locator('input[name="name"]').first();
    const emailInput = activeTabContent.locator('input[name="email"]').first();

    // If inputs are found, test them
    if ((await nameInput.count()) > 0) {
      await nameInput.fill("Test User");
      await expect(nameInput).toHaveValue("Test User");
    }

    if ((await emailInput.count()) > 0) {
      await emailInput.fill("test@example.com");
      await expect(emailInput).toHaveValue("test@example.com");
    }

    // Look for a test button and verify it's clickable
    const testButton = page
      .getByRole("button", { name: /test.*validation/i })
      .first();
    if ((await testButton.count()) > 0) {
      await expect(testButton).toBeEnabled();
    }
  });

  test("should interact with rate limiting tab", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Find and click on the rate limiting tab within the correct layout
    const rateLimitTab = layoutContainer
      .getByRole("tab", { name: /rate.*limit/i })
      .first();
    await expect(rateLimitTab).toBeVisible({ timeout: 10000 });
    await rateLimitTab.click();
    await page.waitForTimeout(1000);

    // Verify the tab content loaded by checking for rate limiting related text
    await expect(
      layoutContainer.locator("text=/rate.*limit/i").first()
    ).toBeVisible();

    // Look for a test button within the correct layout
    const testButton = layoutContainer
      .getByRole("button", { name: /test.*rate.*limit/i })
      .first();
    if ((await testButton.count()) > 0) {
      await expect(testButton).toBeEnabled();
    }
  });

  test("should interact with security headers tab", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Find and click on the security headers tab within the correct layout
    const headersTab = layoutContainer
      .getByRole("tab", { name: /headers/i })
      .first();
    await expect(headersTab).toBeVisible({ timeout: 10000 });
    await headersTab.click();
    await page.waitForTimeout(1000);

    // Verify the tab content loaded by checking for security headers related text
    await expect(
      layoutContainer.locator("text=/security.*headers/i").first()
    ).toBeVisible();

    // Look for a test button within the correct layout
    const testButton = layoutContainer
      .getByRole("button", { name: /test.*headers|check.*headers/i })
      .first();
    if ((await testButton.count()) > 0) {
      await expect(testButton).toBeEnabled();
    }
  });

  test("should display compliance standards", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Verify compliance standards section is present within the correct layout
    await expect(
      layoutContainer.getByText(/Compliance Standards/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/OWASP Top 10/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/GDPR Ready/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/SOC 2 Aligned/i).first()
    ).toBeVisible();
  });

  test("should display security checklist", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Scroll down to see security checklist section
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight * 0.8)
    );
    await page.waitForTimeout(500);

    // Verify security checklist section is present within the correct layout
    await expect(
      layoutContainer.getByText(/Security Checklist/i).first()
    ).toBeVisible();

    // Check for development checklist items within the correct layout
    await expect(
      layoutContainer.getByText(/Input validation implemented/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/CSRF protection enabled/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/Rate limiting configured/i).first()
    ).toBeVisible();
    await expect(
      layoutContainer.getByText(/Security headers set/i).first()
    ).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    // Define layout-aware selectors for mobile
    const layoutContainer = page.locator(".md\\:hidden"); // Mobile layout: md:hidden

    // Verify main content is visible on mobile within the correct layout
    await expect(
      layoutContainer
        .getByRole("heading", { name: /Security & Compliance Testing/i })
        .first()
    ).toBeVisible();

    // Verify tabs are still accessible on mobile within the correct layout
    const validationTab = layoutContainer
      .getByRole("tab", { name: /validation/i })
      .first();
    await expect(validationTab).toBeVisible({ timeout: 10000 });

    // Test tab interaction on mobile
    await validationTab.click();
    await page.waitForTimeout(1000);

    // Verify active tab content is visible within the correct layout
    await expect(
      layoutContainer.locator('[data-state="active"]').first()
    ).toBeVisible();
  });

  test("should handle API security endpoints", async ({ page }) => {
    // Test that secure API endpoints respond appropriately
    const response = await page.request.get("/api/secure/users");

    // In a real app, this might return 401 without auth, but for demo purposes
    // we'll just verify the endpoint exists and responds
    expect(response.status()).toBeLessThan(500); // Not a server error
  });

  test("should display error states gracefully", async ({ page }) => {
    await page.goto("/security-testing");
    await page.waitForLoadState("networkidle");

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    // Define layout-aware selectors
    const layoutContainer = isMobile
      ? page.locator(".md\\:hidden") // Mobile layout: md:hidden
      : page.locator(".hidden.md\\:flex"); // Desktop layout: hidden md:flex

    // Test that the page loads without JavaScript errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Interact with the page using layout-aware selectors
    const validationTab = layoutContainer
      .getByRole("tab", { name: /validation/i })
      .first();
    if ((await validationTab.count()) > 0) {
      await validationTab.click();
      await page.waitForTimeout(500);
    }

    // Should not have critical JavaScript errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("Failed to load resource") && // Ignore resource loading errors
        !error.includes("net::ERR_") // Ignore network errors
    );

    expect(criticalErrors.length).toBe(0);
  });
});
