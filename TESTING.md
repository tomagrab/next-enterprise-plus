# Testing Infrastructure

This template includes a comprehensive testing setup with unit testing, integration testing, and end-to-end testing capabilities.

## Testing Stack

- **Jest** - JavaScript testing framework with Next.js integration
- **React Testing Library** - Testing utilities for React components
- **Playwright** - End-to-end testing framework
- **TypeScript** - Full type safety in tests
- **Custom Mocks** - Comprehensive mocking for Next.js features

## Current Test Status

✅ **All tests passing** - 51 tests across 9 test suites

- API route tests with proper mocking for Next.js runtime
- Component tests with Server Action compatibility
- Color theme system tests
- Security feature testing
- Error boundary testing

## Project Structure

```plaintext
src/
├── __tests__/
│   ├── test-utils.tsx      # Custom render functions and utilities
│   └── fixtures.ts         # Test data and mock objects
├── components/
│   └── **/__tests__/       # Component unit tests
└── app/
    └── api/**/
        └── __tests__/      # API route tests
e2e/
├── home.spec.ts           # Homepage E2E tests
├── color-theme.spec.ts    # Color theme system E2E tests
├── navigation.spec.ts     # Navigation E2E tests
├── auth.spec.ts          # Authentication E2E tests
├── performance.spec.ts   # Performance testing
├── security.spec.ts      # Security features E2E tests
└── visual-regression.spec.ts # Visual regression testing
```

## Running Tests

### Unit & Integration Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (browser visible)
npm run test:e2e:headed

# Run specific test files
npm run test:e2e -- color-theme.spec.ts
npm run test:e2e -- performance.spec.ts

# Run all tests (unit + E2E)
npm run test:all

# Run tests with specific tags or features
npm run test -- --testNamePattern="color theme"
npm run test:e2e -- --grep="performance"
```

## Unit Testing

### Test Utilities

The template provides custom render functions that wrap components with necessary providers:

```typescript
import {
  render,
  renderWithAuth,
  renderWithoutAuth,
} from "@/__tests__/test-utils";

// Render with all providers (theme, session, toaster)
render(<MyComponent />);

// Render with authenticated session
renderWithAuth(<MyComponent />);

// Render without authentication
renderWithoutAuth(<MyComponent />);
```

### Example Component Test

```typescript
import { render, screen } from "@/__tests__/test-utils";
import { Button } from "@/components/ui/button";
import userEvent from "@testing-library/user-event";

describe("Button Component", () => {
  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing API Routes

```typescript
import { NextRequest } from "next/server";
import { GET } from "@/app/api/secure/users/route";

describe("/api/secure/users", () => {
  it("returns users list", async () => {
    const request = new NextRequest("http://localhost:3000/api/secure/users");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("users");
  });
});
```

### Testing Server Actions

Server Actions require special consideration in Jest tests since they don't work in the test environment:

```typescript
// For components using Server Actions, test the UI structure instead
it("handles validation form submission", async () => {
  const user = userEvent.setup();
  render(<SecurityDemo />);

  // Fill and verify form fields
  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");

  // Verify button is clickable (Server Action execution tested elsewhere)
  const submitButton = screen.getByRole("button", { name: /submit/i });
  expect(submitButton).not.toBeDisabled();
});
```

## Mocking

### Global Mocks

The following are automatically mocked in `jest.setup.ts`:

- **Next.js Router** - `useRouter`, `usePathname`, `useSearchParams`
- **NextAuth** - `useSession`, `signIn`, `signOut`
- **Environment Variables** - Default test values
- **Browser APIs** - `fetch`, `matchMedia`, `IntersectionObserver`, `ResizeObserver`
- **Next.js Server Components** - `NextRequest`, `NextResponse` with Jest-compatible implementations

### Jest Configuration for Next.js

The template includes specialized Jest configuration to handle Next.js-specific features:

```typescript
// Custom NextResponse mock for API route testing
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      ok: init?.status ? init.status < 400 : true,
    })),
  },
}));
```

This ensures API route tests work correctly without runtime dependencies.

### Custom Mocks

```typescript
// Mock a specific module
jest.mock("@/lib/security/validation", () => ({
  validateInput: jest.fn(),
}));

// Mock fetch responses
const mockFetch = jest.fn();
global.fetch = mockFetch;

mockFetch.mockResolvedValue(createMockFetchResponse({ success: true }));
```

## E2E Testing

### Test Structure

E2E tests are organized by feature and testing type:

**Functional Tests:**

- **home.spec.ts** - Homepage functionality
- **navigation.spec.ts** - Navigation and routing
- **auth.spec.ts** - Authentication flows
- **color-theme.spec.ts** - Color theme system
- **security.spec.ts** - Security features

**Performance & Quality Tests:**

- **performance.spec.ts** - Page load times, Core Web Vitals
- **visual-regression.spec.ts** - UI screenshot comparisons

### Test Types

#### Functional E2E Tests

Standard user interaction testing:

```typescript
import { test, expect } from "@playwright/test";

test("should load and display the main heading", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Next Enterprise Plus/i })
  ).toBeVisible();
});
```

#### Performance Tests

Comprehensive performance testing with Core Web Vitals, timing metrics, and resource analysis:

```typescript
test("measures Core Web Vitals and page load timing", async ({ page }) => {
  // High precision timing measurement
  const startTime = performance.now();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const totalLoadTime = performance.now() - startTime;

  // Get detailed performance metrics
  const performanceData = await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const paintEntries = performance.getEntriesByType("paint");

    return {
      domContentLoaded:
        navigationEntry?.domContentLoadedEventEnd -
        navigationEntry?.domContentLoadedEventStart,
      domInteractive:
        navigationEntry?.domInteractive - navigationEntry?.fetchStart,
      firstPaint:
        paintEntries.find((entry) => entry.name === "first-paint")?.startTime ||
        0,
      firstContentfulPaint:
        paintEntries.find((entry) => entry.name === "first-contentful-paint")
          ?.startTime || 0,
      resourceCount: performance.getEntriesByType("resource").length,
    };
  });

  // Assert Core Web Vitals thresholds (Google's recommendations)
  expect(performanceData.firstPaint).toBeLessThan(1800); // First Paint < 1.8s
  expect(performanceData.firstContentfulPaint).toBeLessThan(1800); // FCP < 1.8s
  expect(totalLoadTime).toBeLessThan(3000); // Total load < 3s
});

test("measures theme switching response time", async ({ page }) => {
  await page.goto("/color-theme");
  const themes = ["red", "green", "violet", "orange"];

  for (const theme of themes) {
    const startTime = performance.now();
    await page
      .getByRole("button", { name: new RegExp(theme, "i") })
      .first()
      .click();
    await page.waitForFunction(
      (themeName) =>
        document.documentElement.classList.contains(`theme-${themeName}`),
      theme
    );
    const switchTime = performance.now() - startTime;

    expect(switchTime).toBeLessThan(150); // Theme switching should be fast
  }
});

test("measures bundle size and resource loading across pages", async ({
  page,
}) => {
  const pages = ["/", "/color-theme", "/overflow-demo", "/error-testing"];

  for (const pagePath of pages) {
    const startTime = performance.now();
    await page.goto(pagePath);
    await page.waitForLoadState("networkidle");
    const loadTime = performance.now() - startTime;

    const pageMetrics = await page.evaluate(() => {
      const resourceEntries = performance.getEntriesByType("resource");
      const totalSize = resourceEntries.reduce(
        (sum, entry) => sum + (entry.transferSize || 0),
        0
      );
      return { resourceCount: resourceEntries.length, totalSize };
    });

    expect(loadTime).toBeLessThan(3000); // Load within 3 seconds
    expect(pageMetrics.totalSize).toBeLessThan(5 * 1024 * 1024); // < 5MB total
  }
});
```

**Performance Metrics Measured:**

- **Core Web Vitals**: First Paint (FP), First Contentful Paint (FCP), DOM timing
- **Theme Performance**: Color theme switching response times
- **Scroll Performance**: Dynamic content scrolling with frame-accurate timing
- **Memory Usage**: Heap size tracking during theme cycling (browser-compatible)
- **DOM Query Performance**: Element counting and query timing
- **Bundle Analysis**: JS/CSS sizes, resource counts, loading times per page
- **Paint Timing**: CSS loading impact on rendering performance

#### Visual Regression Tests

Screenshot-based UI testing:

```typescript
test("should match homepage visual design", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Take screenshot and compare with baseline
  await expect(page).toHaveScreenshot("homepage-desktop.png");
});

test("should display themes correctly", async ({ page }) => {
  await page.goto("/color-theme");

  // Test each color theme visually
  const themes = ["blue", "green", "orange", "red", "purple", "yellow"];

  for (const theme of themes) {
    await page.click(`[data-testid="theme-${theme}"]`);
    await page.waitForTimeout(100); // Allow theme to apply
    await expect(page.locator(".theme-showcase")).toHaveScreenshot(
      `theme-${theme}.png`
    );
  }
});
```

### Cross-Browser Testing

Playwright tests run across multiple browsers:

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)
- **Mobile Chrome** (Android)
- **Mobile Safari** (iOS)

## Test Data & Fixtures

Use the fixtures file for consistent test data:

```typescript
import { testUsers, testSessions, apiResponses } from "@/__tests__/fixtures";

// Use predefined user data
const user = testUsers.regularUser;

// Use predefined session data
renderWithAuth(<Component />, { session: testSessions.authenticated });
```

## Coverage Requirements

The Jest configuration enforces minimum coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Best Practices

### Unit Testing Best Practices

1. **Test Behavior, Not Implementation** - Focus on what the component does, not how it does it
2. **Use Descriptive Names** - Test names should clearly describe what is being tested
3. **Arrange, Act, Assert** - Structure tests with clear setup, execution, and verification
4. **Mock External Dependencies** - Isolate the code under test

### E2E Testing Best Practices

1. **Test User Journeys** - Focus on complete user workflows
2. **Use Page Object Model** - Create reusable page objects for complex interactions
3. **Wait for Elements** - Use Playwright's auto-waiting, but add explicit waits when needed
4. **Test Cross-Browser** - Ensure compatibility across different browsers

### Security Testing

The template includes specific tests for security features:

```typescript
// Test security headers
test("should have proper security headers", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers();

  expect(headers?.["content-security-policy"]).toBeDefined();
  expect(headers?.["x-frame-options"]).toBeDefined();
});

// Test input validation
test("should validate user input", async () => {
  const request = createNextRequest("/api/secure/users", {
    method: "POST",
    body: JSON.stringify({ email: "invalid" }),
  });

  const response = await POST(request);
  expect(response.status).toBe(400);
});
```

### Color Theme Testing

The template includes comprehensive testing for the color theme system:

#### Color Theme Unit Tests

```typescript
// Test color theme provider
describe("ColorThemeProvider", () => {
  it("provides default blue theme", () => {
    render(<TestComponent />, { wrapper: ColorThemeProvider });
    expect(screen.getByText("blue")).toBeInTheDocument();
  });

  it("changes theme and updates localStorage", async () => {
    const user = userEvent.setup();
    render(<ColorThemeDemo />);

    await user.click(screen.getByText("Green"));
    expect(localStorage.getItem("color-theme")).toBe("green");
  });
});

// Test color theme toggle component
describe("ColorThemeToggle", () => {
  it("opens dropdown menu when clicked", async () => {
    const user = userEvent.setup();
    render(<ColorThemeToggle />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Blue")).toBeVisible();
  });

  it("changes theme when option is selected", async () => {
    const user = userEvent.setup();
    render(<ColorThemeToggle />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Red"));

    expect(mockSetTheme).toHaveBeenCalledWith("red");
  });
});
```

#### Color Theme E2E Tests

```typescript
// Test theme switching functionality
test("should switch color themes", async ({ page }) => {
  await page.goto("/color-theme");

  // Open color theme dropdown
  await page.click('[data-testid="color-theme-toggle"]');
  await page.click("text=Green");

  // Verify theme change
  await expect(page.locator("html")).toHaveClass(/theme-green/);
});

// Test theme persistence
test("should persist theme across page reloads", async ({ page }) => {
  await page.goto("/color-theme");

  // Change theme
  await page.click('[data-testid="color-theme-toggle"]');
  await page.click("text=Purple");

  // Reload and verify persistence
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/theme-purple/);
});
```

#### Integration Tests

```typescript
// Test theme integration with other providers
describe("Providers Integration", () => {
  it("provides all contexts correctly", () => {
    render(<TestComponent />, { wrapper: Providers });

    // Both theme contexts should be available
    expect(screen.getByText("system")).toBeInTheDocument(); // next-themes
    expect(screen.getByText("blue")).toBeInTheDocument(); // color theme
  });
});
```

## Continuous Integration

The testing infrastructure is designed to work in CI environments:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm run test:coverage
    npm run test:e2e

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Debugging Tests

### Unit Tests

```bash
# Debug specific test
npm run test -- --testNamePattern="Button Component"

# Run tests with verbose output
npm run test -- --verbose
```

### E2E Tests

```bash
# Debug with browser open
npm run test:e2e:headed

# Debug with Playwright Inspector
npx playwright test --debug

# Generate test report
npx playwright show-report
```

## IDE Integration

### VS Code

Recommended extensions:

- **Jest** - IntelliSense and debugging for Jest tests
- **Playwright Test for VSCode** - Run and debug Playwright tests
- **Coverage Gutters** - Display test coverage in editor

### Configuration

Add to `.vscode/settings.json`:

```json
{
  "jest.jestCommandLine": "npm run test --",
  "playwright.reuseBrowser": true,
  "playwright.showTrace": true
}
```

This testing infrastructure provides a solid foundation for maintaining code quality and ensuring your application works correctly across different scenarios and environments.
