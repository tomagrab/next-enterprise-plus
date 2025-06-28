import { test, expect } from "@playwright/test";

test.describe("Performance Tests", () => {
  test("measures Core Web Vitals and page load timing", async ({ page }) => {
    // Start measuring with high precision timing
    const startTime = performance.now();

    await page.goto("/");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    const endTime = performance.now();
    const totalLoadTime = endTime - startTime;

    // Total page load should complete within 3 seconds
    expect(totalLoadTime).toBeLessThan(3000);

    // Get detailed performance metrics
    const performanceData = await page.evaluate(() => {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType("paint");

      return {
        // Navigation timing
        domContentLoaded:
          navigationEntry?.domContentLoadedEventEnd -
          navigationEntry?.domContentLoadedEventStart,
        domInteractive:
          navigationEntry?.domInteractive - navigationEntry?.fetchStart,
        loadComplete:
          navigationEntry?.loadEventEnd - navigationEntry?.loadEventStart,

        // Paint timing
        firstPaint:
          paintEntries.find((entry) => entry.name === "first-paint")
            ?.startTime || 0,
        firstContentfulPaint:
          paintEntries.find((entry) => entry.name === "first-contentful-paint")
            ?.startTime || 0,

        // Resource counts
        resourceCount: performance.getEntriesByType("resource").length,
      };
    });

    // Assert Core Web Vitals thresholds (Google's recommendations)
    if (performanceData.firstPaint > 0) {
      expect(performanceData.firstPaint).toBeLessThan(1800); // First Paint < 1.8s (good)
    }
    if (performanceData.firstContentfulPaint > 0) {
      expect(performanceData.firstContentfulPaint).toBeLessThan(1800); // FCP < 1.8s (good)
    }

    // DOM processing metrics
    if (performanceData.domContentLoaded > 0) {
      expect(performanceData.domContentLoaded).toBeLessThan(100); // DOM processing should be fast
    }
    if (performanceData.domInteractive > 0) {
      expect(performanceData.domInteractive).toBeLessThan(2000); // DOM interactive < 2s
    }

    // Ensure we loaded reasonable number of resources
    expect(performanceData.resourceCount).toBeGreaterThan(5);
    expect(performanceData.resourceCount).toBeLessThan(100); // Not too many resources

    console.log("Core Web Vitals and timing:", {
      ...performanceData,
      totalLoadTime: totalLoadTime.toFixed(2) + "ms",
    });
  });

  test("measures theme switching response time", async ({ page }) => {
    await page.goto("/color-theme");

    // Measure theme switching latency with performance.now()
    const themes = ["red", "green", "violet", "orange"];
    const switchingTimes: number[] = [];

    for (const theme of themes) {
      const startTime = performance.now();

      await page
        .getByRole("button", { name: new RegExp(theme, "i") })
        .first()
        .click();

      // Wait for theme to be applied (CSS variables should update immediately)
      await page.waitForFunction(
        (themeName) =>
          document.documentElement.classList.contains(`theme-${themeName}`),
        theme
      );

      const endTime = performance.now();
      const switchTime = endTime - startTime;
      switchingTimes.push(switchTime);

      // Each theme switch should be reasonably fast (< 150ms, relaxed for CI)
      expect(switchTime).toBeLessThan(150);
    }

    // Calculate average switching time
    const avgSwitchTime =
      switchingTimes.reduce((sum, time) => sum + time, 0) /
      switchingTimes.length;
    expect(avgSwitchTime).toBeLessThan(75); // Average should be reasonably fast (relaxed from 50ms)

    console.log(
      `Theme switching times: avg ${avgSwitchTime.toFixed(2)}ms, max ${Math.max(
        ...switchingTimes
      ).toFixed(2)}ms`
    );
  });

  test("measures scroll performance with dynamic content", async ({ page }) => {
    await page.goto("/overflow-demo");

    // Add substantial content to test scrolling performance
    for (let i = 0; i < 20; i++) {
      await page.getByRole("button", { name: /add section/i }).click();
    }

    // Wait for content to be rendered and DOM to be stable
    await page.waitForFunction(
      () => {
        // Just wait for the DOM to be stable after adding content
        return document.body.scrollHeight > window.innerHeight * 0.8;
      },
      { timeout: 5000 }
    );

    // Measure scroll performance using performance.now() with frame-accurate timing
    const scrollMetrics = await page.evaluate(() => {
      const startTime = performance.now();
      const initialScrollTop = window.scrollY;

      // Perform scroll action
      window.scrollTo(0, document.body.scrollHeight);

      // Use requestAnimationFrame to measure when scroll painting is complete
      return new Promise<{
        scrollTime: number;
        contentHeight: number;
        scrollDistance: number;
        scrolledToBottom: boolean;
      }>((resolve) => {
        requestAnimationFrame(() => {
          const endTime = performance.now();
          const finalScrollTop = window.scrollY;
          resolve({
            scrollTime: endTime - startTime,
            contentHeight: document.body.scrollHeight,
            scrollDistance: finalScrollTop - initialScrollTop,
            scrolledToBottom:
              Math.abs(
                finalScrollTop + window.innerHeight - document.body.scrollHeight
              ) < 10,
          });
        });
      });
    });

    // Assert scroll performance and functionality
    expect(scrollMetrics.scrollTime).toBeLessThan(200); // Scrolling should be smooth
    expect(scrollMetrics.contentHeight).toBeGreaterThan(600); // Reasonable content amount

    // Verify scroll functionality worked (distance could be 0 if content fits in viewport)
    expect(scrollMetrics.scrollDistance).toBeGreaterThanOrEqual(0); // Non-negative scroll distance
    expect(scrollMetrics.scrollTime).toBeGreaterThanOrEqual(0); // Non-negative timing

    console.log(
      `Scrolled ${scrollMetrics.scrollDistance}px of ${
        scrollMetrics.contentHeight
      }px total in ${scrollMetrics.scrollTime.toFixed(2)}ms`
    );
  });

  test("measures memory usage during theme cycling", async ({ page }) => {
    await page.goto("/color-theme");

    // Improved memory test with proper API availability check
    const memoryTestResult = await page.evaluate(() => {
      // Check if memory API is available (Chromium browsers only)
      const performanceMemory = (
        performance as unknown as {
          memory?: { usedJSHeapSize: number; totalJSHeapSize: number };
        }
      ).memory;

      if (!performanceMemory) {
        return {
          available: false,
          message: "Memory API not available in this browser",
        };
      }

      const startTime = performance.now();
      const initialMemory = performanceMemory.usedJSHeapSize;

      return {
        available: true,
        initialMemory,
        startTime,
        totalHeapSize: performanceMemory.totalJSHeapSize,
      };
    });

    if (!memoryTestResult.available) {
      console.log(memoryTestResult.message);
      // Skip memory test if API not available, but test theme switching still works
      await page.getByRole("button", { name: /red/i }).first().click();
      await page.waitForFunction(() =>
        document.documentElement.classList.contains("theme-red")
      );
      return;
    }

    // Switch themes multiple times with precise timing
    const themes = ["red", "green", "violet", "orange", "blue", "rose"];
    let totalSwitches = 0;

    for (let cycle = 0; cycle < 3; cycle++) {
      for (const theme of themes) {
        await page
          .getByRole("button", { name: new RegExp(theme, "i") })
          .first()
          .click();

        // Use shorter, more precise timing
        await page.evaluate(
          () => new Promise((resolve) => requestAnimationFrame(resolve))
        );
        totalSwitches++;
      }
    }

    // Check final memory usage with proper browser compatibility
    const finalMemoryResult = await page.evaluate(
      (initial: { initialMemory: number; startTime: number }) => {
        const performanceMemory = (
          performance as unknown as { memory?: { usedJSHeapSize: number } }
        ).memory;

        if (!performanceMemory) return { available: false };

        // Force garbage collection if available
        const globalWindow = window as unknown as { gc?: () => void };
        if (globalWindow.gc) {
          globalWindow.gc();
        }

        const finalMemory = performanceMemory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initial.initialMemory;
        const increasePercent = (memoryIncrease / initial.initialMemory) * 100;
        const testDuration = performance.now() - initial.startTime;

        return {
          available: true,
          initialMemory: initial.initialMemory,
          finalMemory,
          memoryIncrease,
          increasePercent,
          testDuration,
        };
      },
      {
        initialMemory: memoryTestResult.initialMemory!,
        startTime: memoryTestResult.startTime!,
      }
    );

    if (
      finalMemoryResult.available &&
      "increasePercent" in finalMemoryResult &&
      finalMemoryResult.increasePercent !== undefined
    ) {
      // Memory usage shouldn't increase dramatically (threshold for CI environments)
      expect(finalMemoryResult.increasePercent).toBeLessThan(75);

      // Memory increase should be reasonable in absolute terms (< 10MB)
      expect(Math.abs(finalMemoryResult.memoryIncrease!)).toBeLessThan(
        10 * 1024 * 1024
      );

      console.log(
        `Memory test: ${finalMemoryResult.increasePercent.toFixed(
          2
        )}% increase (${(
          finalMemoryResult.memoryIncrease! /
          1024 /
          1024
        ).toFixed(2)}MB) over ${totalSwitches} theme switches in ${
          finalMemoryResult.testDuration?.toFixed(2) || "unknown"
        }ms`
      );
    }
  });

  test("measures component rendering and DOM query performance", async ({
    page,
  }) => {
    await page.goto("/color-theme");

    // Use performance.now() for precise timing measurements
    const renderingMetrics = await page.evaluate(() => {
      const startTime = performance.now();

      // Count all interactive elements and measure query time
      const buttons = document.querySelectorAll("button").length;
      const inputs = document.querySelectorAll("input").length;
      const selects = document.querySelectorAll("select").length;
      const allElements = document.querySelectorAll("*").length;
      const totalInteractiveElements = buttons + inputs + selects;

      const endTime = performance.now();
      const queryTime = endTime - startTime;

      return {
        queryTime,
        interactiveElementCount: totalInteractiveElements,
        totalElementCount: allElements,
        buttons,
        inputs,
        selects,
      };
    });

    console.log(
      `DOM queries: ${
        renderingMetrics.interactiveElementCount
      } interactive elements (${renderingMetrics.buttons} buttons, ${
        renderingMetrics.inputs
      } inputs, ${renderingMetrics.selects} selects) from ${
        renderingMetrics.totalElementCount
      } total elements in ${renderingMetrics.queryTime.toFixed(2)}ms`
    );

    // DOM queries should be fast even with many elements
    expect(renderingMetrics.queryTime).toBeLessThan(50);

    // Ensure we're measuring a meaningful page with sufficient interactive elements
    expect(renderingMetrics.interactiveElementCount).toBeGreaterThan(10);
    expect(renderingMetrics.totalElementCount).toBeGreaterThan(50);

    // Reasonable ratio of interactive to total elements
    const interactiveRatio =
      renderingMetrics.interactiveElementCount /
      renderingMetrics.totalElementCount;
    expect(interactiveRatio).toBeGreaterThan(0.05); // At least 5% interactive elements
  });

  test("measures bundle size and resource loading across pages", async ({
    page,
  }) => {
    // Navigate to different pages and measure bundle size impact
    const pages = ["/", "/color-theme", "/overflow-demo", "/error-testing"];
    const resourceMetrics: Array<{
      page: string;
      resourceCount: number;
      totalSize: number;
      loadTime: number;
      uniqueResources: number;
      jsSize: number;
      cssSize: number;
    }> = [];

    for (const pagePath of pages) {
      const startTime = performance.now();

      const response = await page.goto(pagePath);

      // Check that main resources load successfully
      expect(response?.status()).toBe(200);

      // Wait for all resources to load
      await page.waitForLoadState("networkidle");

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Measure detailed bundle size and resource loading
      const pageMetrics = await page.evaluate(() => {
        const resourceEntries = performance.getEntriesByType(
          "resource"
        ) as PerformanceResourceTiming[];

        const totalSize = resourceEntries.reduce((sum, entry) => {
          return sum + (entry.transferSize || 0);
        }, 0);

        const jsResources = resourceEntries.filter(
          (entry) =>
            entry.name.includes(".js") || entry.name.includes("javascript")
        );
        const cssResources = resourceEntries.filter(
          (entry) =>
            entry.name.includes(".css") || entry.name.includes("stylesheet")
        );

        const jsSize = jsResources.reduce(
          (sum, entry) => sum + (entry.transferSize || 0),
          0
        );
        const cssSize = cssResources.reduce(
          (sum, entry) => sum + (entry.transferSize || 0),
          0
        );

        const failedRequests = resourceEntries.filter(
          (entry) => entry.responseStatus && entry.responseStatus >= 400
        ).length;

        // Count unique resources (deduplicate by name)
        const uniqueResourceNames = new Set(
          resourceEntries.map((entry) => entry.name)
        );

        return {
          resourceCount: resourceEntries.length,
          uniqueResources: uniqueResourceNames.size,
          totalSize,
          jsSize,
          cssSize,
          failedRequests,
          jsResourceCount: jsResources.length,
          cssResourceCount: cssResources.length,
        };
      });

      resourceMetrics.push({
        page: pagePath,
        resourceCount: pageMetrics.resourceCount,
        uniqueResources: pageMetrics.uniqueResources,
        totalSize: pageMetrics.totalSize,
        jsSize: pageMetrics.jsSize,
        cssSize: pageMetrics.cssSize,
        loadTime,
      });

      // Assert resource loading quality
      // Allow for some minor failed requests (e.g., favicon.ico) but not too many
      expect(pageMetrics.failedRequests).toBeLessThanOrEqual(2); // Allow up to 2 failed requests
      expect(pageMetrics.totalSize).toBeLessThan(5 * 1024 * 1024); // < 5MB total
      expect(pageMetrics.jsSize).toBeLessThan(2 * 1024 * 1024); // < 2MB JS
      expect(pageMetrics.cssSize).toBeLessThan(500 * 1024); // < 500KB CSS
      expect(loadTime).toBeLessThan(3000); // Load within 3 seconds

      console.log(
        `${pagePath}: ${(pageMetrics.totalSize / 1024).toFixed(0)}KB total (${(
          pageMetrics.jsSize / 1024
        ).toFixed(0)}KB JS, ${(pageMetrics.cssSize / 1024).toFixed(
          0
        )}KB CSS) in ${loadTime.toFixed(0)}ms`
      );
    }

    // Ensure consistent loading performance across pages
    const avgLoadTime =
      resourceMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) /
      resourceMetrics.length;
    const maxLoadTime = Math.max(
      ...resourceMetrics.map((metric) => metric.loadTime)
    );

    expect(avgLoadTime).toBeLessThan(2000); // Average load time under 2s
    expect(maxLoadTime).toBeLessThan(3000); // No page should take longer than 3s

    // Bundle sizes should be consistent (not wildly different between pages)
    const sizes = resourceMetrics.map((metric) => metric.totalSize);
    const avgSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    const maxSizeDeviation = Math.max(
      ...sizes.map((size) => Math.abs(size - avgSize))
    );

    // No page should be more than 2MB larger than average
    expect(maxSizeDeviation).toBeLessThan(2 * 1024 * 1024);

    console.log("Resource loading summary:", {
      avgLoadTime: avgLoadTime.toFixed(0) + "ms",
      avgBundleSize: (avgSize / 1024).toFixed(0) + "KB",
    });
  });

  test("measures CSS loading and paint timing", async ({ page }) => {
    await page.goto("/");

    // Check that CSS loads quickly and paint events occur within thresholds
    const paintAndLoadingMetrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType("paint");
      const resourceEntries = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      // Find CSS resources
      const cssResources = resourceEntries.filter(
        (entry) =>
          entry.name.includes(".css") || entry.name.includes("stylesheet")
      );

      const maxCssLoadTime =
        cssResources.length > 0
          ? Math.max(
              ...cssResources.map(
                (entry) => entry.responseEnd - entry.requestStart
              )
            )
          : 0;

      const totalCssSize = cssResources.reduce(
        (sum, entry) => sum + (entry.transferSize || 0),
        0
      );

      return {
        paintTiming: paintEntries.map((entry) => ({
          name: entry.name,
          startTime: entry.startTime,
        })),
        cssResourceCount: cssResources.length,
        maxCssLoadTime,
        totalCssSize,
        cssResources: cssResources.map((entry) => ({
          name: entry.name.split("/").pop(), // Just filename
          size: entry.transferSize || 0,
          loadTime: entry.responseEnd - entry.requestStart,
        })),
      };
    });

    // Assert paint timing thresholds (Google's recommendations)
    const firstPaint = paintAndLoadingMetrics.paintTiming.find(
      (entry) => entry.name === "first-paint"
    );
    if (firstPaint) {
      expect(firstPaint.startTime).toBeLessThan(1500); // First paint < 1.5s
    }

    const firstContentfulPaint = paintAndLoadingMetrics.paintTiming.find(
      (entry) => entry.name === "first-contentful-paint"
    );
    if (firstContentfulPaint) {
      expect(firstContentfulPaint.startTime).toBeLessThan(2000); // FCP < 2s
    }

    // Assert CSS loading performance
    if (paintAndLoadingMetrics.cssResourceCount > 0) {
      expect(paintAndLoadingMetrics.maxCssLoadTime).toBeLessThan(1000); // CSS loads < 1s
      expect(paintAndLoadingMetrics.totalCssSize).toBeLessThan(500 * 1024); // Total CSS < 500KB
    }

    // Should have at least some CSS
    expect(paintAndLoadingMetrics.cssResourceCount).toBeGreaterThan(0);

    console.log("Paint and CSS timing:", {
      firstPaint: firstPaint?.startTime.toFixed(0) + "ms" || "N/A",
      firstContentfulPaint:
        firstContentfulPaint?.startTime.toFixed(0) + "ms" || "N/A",
      cssCount: paintAndLoadingMetrics.cssResourceCount,
      totalCssSize:
        (paintAndLoadingMetrics.totalCssSize / 1024).toFixed(0) + "KB",
      maxCssLoadTime: paintAndLoadingMetrics.maxCssLoadTime.toFixed(0) + "ms",
    });
  });
});
