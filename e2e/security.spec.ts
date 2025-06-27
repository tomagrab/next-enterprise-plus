import { test, expect } from "@playwright/test";

test.describe("Security Features", () => {
  test("should have proper security headers", async ({ page }) => {
    const response = await page.goto("/");

    // Check for security headers
    const headers = response?.headers();
    if (headers) {
      // Content Security Policy
      expect(headers["content-security-policy"]).toBeDefined();

      // X-Frame-Options
      expect(headers["x-frame-options"]).toBeDefined();

      // X-Content-Type-Options
      expect(headers["x-content-type-options"]).toBe("nosniff");
    }
  });

  test("should test security demo functionality", async ({ page }) => {
    await page.goto("/");

    // Navigate to security demo
    await page
      .getByText("Security & Compliance Testing")
      .scrollIntoViewIfNeeded();

    // Test input validation tab
    await page.getByRole("tab", { name: /validation/i }).click();

    // Fill in the form with valid data
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="age"]', "25");

    // Submit the form
    await page.getByRole("button", { name: /test validation/i }).click();

    // Should see some result
    await expect(page.getByText(/validation result/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should test rate limiting", async ({ page }) => {
    await page.goto("/");

    // Navigate to security demo
    await page
      .getByText("Security & Compliance Testing")
      .scrollIntoViewIfNeeded();

    // Test rate limiting tab
    await page.getByRole("tab", { name: /rate limiting/i }).click();

    // Click the rate limit test button
    await page.getByRole("button", { name: /test rate limiting/i }).click();

    // Should see rate limit results
    await expect(page.getByText(/rate limit results/i)).toBeVisible({
      timeout: 15000,
    });
  });

  test("should test security headers check", async ({ page }) => {
    await page.goto("/");

    // Navigate to security demo
    await page
      .getByText("Security & Compliance Testing")
      .scrollIntoViewIfNeeded();

    // Test security headers tab
    await page.getByRole("tab", { name: /security headers/i }).click();

    // Click the headers test button
    await page.getByRole("button", { name: /test security headers/i }).click();

    // Should see security headers results
    await expect(page.getByText(/security headers/i)).toBeVisible({
      timeout: 10000,
    });
  });
});
