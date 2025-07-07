import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.describe("Desktop Layout Tests", () => {
    test.beforeEach(async ({ page }) => {
      // Set desktop viewport (>= 768px triggers desktop layout)
      await page.setViewportSize({ width: 1200, height: 800 });
    });

    test("home page visual consistency - desktop", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Desktop layout has sidebar, so screenshot full layout
      await expect(page).toHaveScreenshot("desktop-home-page.png", {
        fullPage: true,
        threshold: 0.2,
      });
    });

    test("color theme page visual consistency - desktop", async ({ page }) => {
      await page.goto("/color-theme");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("desktop-color-theme-page.png", {
        fullPage: true,
        threshold: 0.2,
      });
    });
  });

  test.describe("Mobile Layout Tests", () => {
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport (< 768px triggers mobile layout)
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test("home page visual consistency - mobile", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Mobile layout has header + bottom nav, different structure
      await expect(page).toHaveScreenshot("mobile-home-page.png", {
        fullPage: true,
        threshold: 0.2,
      });
    });

    test("color theme page visual consistency - mobile", async ({ page }) => {
      await page.goto("/color-theme");
      await page.waitForLoadState("networkidle");

      // Mobile may need scrolling to see all content
      await page.evaluate(() => window.scrollTo(0, window.innerHeight / 2));
      await page.waitForLoadState("domcontentloaded");

      await expect(page).toHaveScreenshot("mobile-color-theme-page.png", {
        fullPage: true,
        threshold: 0.2,
      });
    });
  });

  test("color themes visual differences", async ({ page }) => {
    // Test on desktop first
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/color-theme");
    await page.waitForLoadState("networkidle");

    const themes = ["blue", "red", "rose", "orange", "green", "violet"];

    for (const theme of themes) {
      // Click theme button - use .first() to handle duplicate desktop/mobile content
      const themeButton = page
        .getByRole("button", { name: new RegExp(theme, "i") })
        .first();
      await themeButton.click();

      // Wait for theme to apply by checking HTML class
      await page.waitForFunction(
        (themeName) =>
          document.documentElement.classList.contains(`theme-${themeName}`),
        theme
      );

      // Screenshot the main content area directly to avoid strict mode violations
      const mainContent = page.locator("main").first();
      await expect(mainContent).toHaveScreenshot(
        `desktop-theme-${theme}-demo.png`,
        {
          threshold: 0.3,
        }
      );
    }

    // Test same themes on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/color-theme");
    await page.waitForLoadState("networkidle");

    for (const theme of themes) {
      // Click theme button - mobile layout may have different positioning
      const themeButton = page
        .getByRole("button", { name: new RegExp(theme, "i") })
        .first();
      await themeButton.click();

      // Wait for theme to apply by checking HTML class
      await page.waitForFunction(
        (themeName) =>
          document.documentElement.classList.contains(`theme-${themeName}`),
        theme
      );

      // Screenshot the whole page for mobile since layout is different
      await expect(page).toHaveScreenshot(`mobile-theme-${theme}-demo.png`, {
        threshold: 0.3,
        fullPage: true,
      });
    }
  });

  test("light and dark mode consistency", async ({ page }) => {
    // Test on desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/color-theme");

    // Light mode - use .first() to handle duplicates
    await page.getByRole("button", { name: "☀️ Light Mode" }).first().click();
    await page.waitForFunction(
      () => !document.documentElement.classList.contains("dark")
    );
    await expect(page).toHaveScreenshot("desktop-light-mode.png", {
      fullPage: true,
      threshold: 0.2,
    });

    // Dark mode - use .first() to handle duplicates
    await page.getByRole("button", { name: "🌙 Dark Mode" }).first().click();
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("dark")
    );
    await expect(page).toHaveScreenshot("desktop-dark-mode.png", {
      fullPage: true,
      threshold: 0.2,
    });

    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/color-theme");

    // Light mode on mobile
    await page.getByRole("button", { name: "☀️ Light Mode" }).first().click();
    await page.waitForFunction(
      () => !document.documentElement.classList.contains("dark")
    );
    await expect(page).toHaveScreenshot("mobile-light-mode.png", {
      fullPage: true,
      threshold: 0.2,
    });

    // Dark mode on mobile
    await page.getByRole("button", { name: "🌙 Dark Mode" }).first().click();
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("dark")
    );
    await expect(page).toHaveScreenshot("mobile-dark-mode.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("navigation differences between mobile and desktop", async ({
    page,
  }, testInfo) => {
    // Check if this is a mobile project based on the project name
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (isMobileProject) {
      // Mobile browser project: Only test mobile navigation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Mobile has bottom navigation bar - no sidebar exists
      await expect(page).toHaveScreenshot("mobile-bottom-navigation.png", {
        threshold: 0.2,
      });

      // Test mobile "more" menu if it exists
      const moreButton = page
        .getByRole("button", { name: /more/i })
        .or(page.locator("[data-component='mobile-more-button']"));
      if (await moreButton.isVisible()) {
        await moreButton.click();
        await page.waitForSelector('[role="dialog"]', { state: "visible" });
        await expect(page).toHaveScreenshot("mobile-more-menu-open.png", {
          threshold: 0.2,
        });
      }
    } else {
      // Desktop browser project: Test both desktop and mobile layouts

      // Desktop: Test sidebar navigation
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Desktop has sidebar on the left
      await expect(page).toHaveScreenshot("desktop-sidebar-navigation.png", {
        threshold: 0.2,
      });

      // Test sidebar toggle functionality (desktop only)
      const sidebarTrigger = page.locator('[data-sidebar="trigger"]').first();
      if (await sidebarTrigger.isVisible()) {
        await sidebarTrigger.click();

        // Wait for sidebar animation to complete by checking data-state
        await page.waitForFunction(() => {
          const sidebar = document.querySelector("[data-state]");
          return sidebar && sidebar.getAttribute("data-state") === "collapsed";
        });

        await expect(page).toHaveScreenshot("desktop-sidebar-collapsed.png", {
          threshold: 0.2,
        });
      }

      // Test mobile viewport within desktop browser
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Mobile has bottom navigation bar (when viewed in desktop browser)
      await expect(page).toHaveScreenshot("mobile-bottom-navigation.png", {
        threshold: 0.2,
      });
    }
  });

  test("error states visual consistency across viewports", async ({ page }) => {
    // Test error states on desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/error-testing");
    await page.waitForLoadState("networkidle");

    // Test client error on desktop
    const clientErrorButton = page.getByRole("button", {
      name: /trigger client error/i,
    });
    if (await clientErrorButton.isVisible()) {
      await clientErrorButton.first().click();
      await expect(
        page.locator(".error-boundary, [data-error], .error")
      ).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveScreenshot("desktop-client-error-state.png", {
        threshold: 0.2,
      });
    }

    // Reset and test on mobile
    await page.reload();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/error-testing");
    await page.waitForLoadState("networkidle");

    // Test client error on mobile
    const mobileClientErrorButton = page.getByRole("button", {
      name: /trigger client error/i,
    });
    if (await mobileClientErrorButton.isVisible()) {
      await mobileClientErrorButton.first().click();
      await expect(
        page.locator(".error-boundary, [data-error], .error")
      ).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveScreenshot("mobile-client-error-state.png", {
        threshold: 0.2,
      });
    }
  });

  test("form elements visual consistency across viewports", async ({
    page,
  }) => {
    // Test form elements on desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/color-theme");
    await page.waitForLoadState("networkidle");

    // Wait for the page to fully load and all components to be available
    await expect(
      page.locator('[data-component="color-theme-demo"]')
    ).toBeVisible({ timeout: 10000 }); // Try to find the form elements section using multiple strategies
    let formSection = page.locator('[data-component="form-elements"]').first();

    if ((await formSection.count()) === 0) {
      // Fallback: look for the card containing form elements
      formSection = page
        .locator(".space-y-4")
        .filter({ hasText: "Form Elements" })
        .first();
    }

    if ((await formSection.count()) === 0) {
      // Second fallback: look for any form-like container
      formSection = page
        .locator("form")
        .first()
        .or(page.locator(".grid").filter({ hasText: "Input" }).first());
    }

    if (
      (await formSection.count()) > 0 &&
      (await formSection.first().isVisible())
    ) {
      await formSection.scrollIntoViewIfNeeded();
      await expect(formSection).toHaveScreenshot("desktop-form-elements.png", {
        threshold: 0.3,
      });

      // Test form interactions on desktop
      const inputField = formSection.locator("input").first();
      const toggleSwitch = formSection.locator('[role="switch"]').first();

      if ((await inputField.count()) > 0) {
        await inputField.fill("Test input");
      }
      if ((await toggleSwitch.count()) > 0) {
        await toggleSwitch.click();
      }

      await expect(formSection).toHaveScreenshot(
        "desktop-form-elements-filled.png",
        {
          threshold: 0.3,
        }
      );
    } else {
      // If no form elements found, screenshot the main content area
      console.log("No form elements found, taking screenshot of main content");
      await expect(page.locator("main")).toHaveScreenshot(
        "desktop-form-elements.png",
        {
          threshold: 0.3,
        }
      );
    }

    // Test form elements on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/color-theme");
    await page.waitForLoadState("networkidle");
    await expect(
      page.locator('[data-component="color-theme-demo"]')
    ).toBeVisible({ timeout: 10000 });

    // Find mobile form section using the same strategies
    let mobileFormSection = page
      .locator('[data-component="form-elements"]')
      .first();

    if ((await mobileFormSection.count()) === 0) {
      mobileFormSection = page
        .locator(".space-y-4")
        .filter({ hasText: "Form Elements" })
        .first();
    }

    if ((await mobileFormSection.count()) === 0) {
      mobileFormSection = page
        .locator("form")
        .first()
        .or(page.locator(".grid").filter({ hasText: "Input" }).first());
    }

    if (
      (await mobileFormSection.count()) > 0 &&
      (await mobileFormSection.first().isVisible())
    ) {
      await mobileFormSection.scrollIntoViewIfNeeded();
      await expect(mobileFormSection).toHaveScreenshot(
        "mobile-form-elements.png",
        {
          threshold: 0.3,
        }
      );

      // Test form interactions on mobile
      const mobileInputField = mobileFormSection.locator("input").first();
      const mobileToggleSwitch = mobileFormSection
        .locator('[role="switch"]')
        .first();

      if ((await mobileInputField.count()) > 0) {
        await mobileInputField.fill("Mobile test");
      }
      if ((await mobileToggleSwitch.count()) > 0) {
        await mobileToggleSwitch.click();
      }

      await expect(mobileFormSection).toHaveScreenshot(
        "mobile-form-elements-filled.png",
        {
          threshold: 0.3,
        }
      );
    } else {
      // If no mobile form elements found, screenshot the whole page for mobile
      console.log(
        "No mobile form elements found, taking screenshot of full page"
      );
      await expect(page).toHaveScreenshot("mobile-form-elements.png", {
        threshold: 0.3,
        fullPage: true,
      });
    }
  });

  test("mobile scrolling behavior", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/color-theme");
    await page.waitForLoadState("networkidle");

    // Test top of page
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);
    await expect(page).toHaveScreenshot("mobile-color-theme-top.png", {
      threshold: 0.2,
    });

    // Test middle of page (where most components are)
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForFunction(
      () => window.scrollY >= window.innerHeight * 0.9
    );
    await expect(page).toHaveScreenshot("mobile-color-theme-middle.png", {
      threshold: 0.2,
    });

    // Test bottom of page (should show bottom navigation)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(
      () =>
        window.scrollY >= document.body.scrollHeight - window.innerHeight - 10
    );
    await expect(page).toHaveScreenshot("mobile-color-theme-bottom.png", {
      threshold: 0.2,
    });
  });
});
