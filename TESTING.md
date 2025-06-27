# Testing Infrastructure

This template includes a comprehensive testing setup with unit testing, integration testing, and end-to-end testing capabilities.

## Testing Stack

- **Jest** - JavaScript testing framework with Next.js integration
- **React Testing Library** - Testing utilities for React components
- **Playwright** - End-to-end testing framework
- **TypeScript** - Full type safety in tests
- **Custom Mocks** - Comprehensive mocking for Next.js features

## Current Test Status

✅ **All tests passing** - 22 tests across 4 test suites

- API route tests with proper mocking for Next.js runtime
- Component tests with Server Action compatibility
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
├── navigation.spec.ts     # Navigation E2E tests
├── auth.spec.ts          # Authentication E2E tests
└── security.spec.ts      # Security features E2E tests
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

# Run all tests (unit + E2E)
npm run test:all
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

E2E tests are organized by feature:

- **home.spec.ts** - Homepage functionality
- **navigation.spec.ts** - Navigation and routing
- **auth.spec.ts** - Authentication flows
- **security.spec.ts** - Security features

### Example E2E Test

```typescript
import { test, expect } from "@playwright/test";

test("should load and display the main heading", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Next Enterprise Plus/i })
  ).toBeVisible();
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
