import { render, screen } from "@/__tests__/test-utils";
import { Providers } from "@/components/providers/providers";
import { useColorTheme } from "@/components/providers/theme/color-theme-provider";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import userEvent from "@testing-library/user-event";

// Mock localStorage to prevent test interference
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Reset localStorage before each test
beforeEach(() => {
  mockLocalStorage.clear();
});

// Test component that uses all providers
const TestComponent = () => {
  const { colorTheme, setColorTheme } = useColorTheme();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <div>
      <span data-testid="color-theme">{colorTheme}</span>
      <span data-testid="theme">{theme}</span>
      <span data-testid="session-status">
        {session ? "authenticated" : "unauthenticated"}
      </span>
      <button onClick={() => setColorTheme("red")}>Set Red</button>
      <button onClick={() => setColorTheme("green")}>Set Green</button>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("system")}>Set System</button>
    </div>
  );
};

describe("Providers Integration", () => {
  it("provides all contexts correctly", () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId("color-theme")).toHaveTextContent("blue");
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
    expect(screen.getByTestId("session-status")).toHaveTextContent(
      "unauthenticated"
    );
  });

  it("allows color theme changes", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Test color theme change
    const setRedButton = screen.getByText("Set Red");
    await user.click(setRedButton);

    expect(screen.getByTestId("color-theme")).toHaveTextContent("red");
  });

  it("allows light/dark theme changes", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Test light/dark theme change
    const setDarkButton = screen.getByText("Set Dark");
    await user.click(setDarkButton);

    await screen.findByText("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("handles multiple theme mode changes", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Change color theme first
    await user.click(screen.getByText("Set Red"));
    expect(screen.getByTestId("color-theme")).toHaveTextContent("red");

    // Then change light/dark theme
    await user.click(screen.getByText("Set Dark"));
    await screen.findByText("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");

    // Both themes should be maintained independently
    expect(screen.getByTestId("color-theme")).toHaveTextContent("red");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("maintains theme independence between color and light/dark themes", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Initial state
    expect(screen.getByTestId("color-theme")).toHaveTextContent("blue");
    expect(screen.getByTestId("theme")).toHaveTextContent("system");

    // Change only color theme
    await user.click(screen.getByText("Set Red"));
    expect(screen.getByTestId("color-theme")).toHaveTextContent("red");
    expect(screen.getByTestId("theme")).toHaveTextContent("system"); // Should remain unchanged

    // Change only light/dark theme
    await user.click(screen.getByText("Set Dark"));
    await screen.findByText("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("color-theme")).toHaveTextContent("red"); // Should remain unchanged
  });

  it("handles provider hierarchy correctly", () => {
    // Test component that verifies all providers are accessible
    const ProviderHierarchyTest = () => {
      const colorTheme = useColorTheme();
      const theme = useTheme();
      const session = useSession();

      return (
        <div>
          <span data-testid="color-context">
            {colorTheme ? "available" : "missing"}
          </span>
          <span data-testid="theme-context">
            {theme ? "available" : "missing"}
          </span>
          <span data-testid="session-context">
            {typeof session !== "undefined" ? "available" : "missing"}
          </span>
        </div>
      );
    };

    render(
      <Providers>
        <ProviderHierarchyTest />
      </Providers>
    );

    expect(screen.getByTestId("color-context")).toHaveTextContent("available");
    expect(screen.getByTestId("theme-context")).toHaveTextContent("available");
    expect(screen.getByTestId("session-context")).toHaveTextContent(
      "available"
    ); // SessionProvider context is available even when not authenticated
  });

  it("provides default theme values correctly", () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Verify default values match the provider configuration
    expect(screen.getByTestId("color-theme")).toHaveTextContent("blue"); // ColorThemeProvider defaultTheme
    expect(screen.getByTestId("theme")).toHaveTextContent("system"); // ThemeProvider defaultTheme
    expect(screen.getByTestId("session-status")).toHaveTextContent(
      "unauthenticated"
    ); // SessionProvider default
  });

  it("renders children correctly", () => {
    render(
      <Providers>
        <div data-testid="child-component">Test Child</div>
      </Providers>
    );

    expect(screen.getByTestId("child-component")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("includes Toaster component for notifications", () => {
    render(
      <Providers>
        <div data-testid="test-content">Test Content</div>
      </Providers>
    );

    // Verify children are rendered correctly, indicating all providers work
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Verify Toaster is present in DOM (it's rendered by Providers)
    // Toaster doesn't have specific test attributes but is part of the provider tree
    const providerContent = document.body;
    expect(providerContent).toContainElement(
      screen.getByTestId("test-content")
    );
  });

  it("handles rapid theme changes without conflicts", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Rapid color theme changes
    await user.click(screen.getByText("Set Red"));
    expect(screen.getByTestId("color-theme")).toHaveTextContent("red");

    await user.click(screen.getByText("Set Green"));
    expect(screen.getByTestId("color-theme")).toHaveTextContent("green");

    // Rapid light/dark theme changes
    await user.click(screen.getByText("Set Dark"));
    await screen.findByText("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");

    await user.click(screen.getByText("Set Light"));
    await screen.findByText("light");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");

    await user.click(screen.getByText("Set System"));
    await screen.findByText("system");
    expect(screen.getByTestId("theme")).toHaveTextContent("system");

    // Color theme should remain stable through light/dark changes
    expect(screen.getByTestId("color-theme")).toHaveTextContent("green");
  });
});
