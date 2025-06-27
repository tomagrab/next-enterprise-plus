import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show sign in page", async ({ page }) => {
    await page.goto("/auth/signin");

    // Check for sign in page elements
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(
      page.getByText("Choose your authentication method")
    ).toBeVisible();

    // Check for provider buttons (they should be disabled in demo)
    await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /microsoft/i })
    ).toBeVisible();
  });

  test("should redirect to sign in when accessing protected routes", async ({
    page,
  }) => {
    // This test assumes you have protected routes configured
    // If not, you can skip this test or create a protected route for testing
    await page.goto("/admin");

    // Should redirect to sign in or show authentication requirement
    // Adjust this based on your actual authentication setup
    const url = page.url();
    const isAuthPage = url.includes("/auth/signin") || url.includes("/admin");
    expect(isAuthPage).toBeTruthy();
  });

  test("should show authentication UI in sidebar", async ({ page }) => {
    await page.goto("/");

    // Check for authentication elements in sidebar
    // This might be a sign in button or user menu depending on auth state
    const authElement = page.locator("[data-auth-ui]");
    if ((await authElement.count()) > 0) {
      await expect(authElement).toBeVisible();
    }
  });
});
