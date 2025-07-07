import { render, screen } from "@/__tests__/test-utils";
import {
  ColorThemeProvider,
  useColorTheme,
} from "@/components/providers/theme/color-theme-provider";
import { act, renderHook } from "@testing-library/react";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Test component that uses the hook
const TestComponent = () => {
  const { colorTheme, setColorTheme } = useColorTheme();
  return (
    <div>
      <span data-testid="current-theme">{colorTheme}</span>
      <button onClick={() => setColorTheme("red")}>Set Red Theme</button>
      <button onClick={() => setColorTheme("green")}>Set Green Theme</button>
    </div>
  );
};

describe("ColorThemeProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear all classes from document element
    document.documentElement.className = "";
  });

  it("provides default blue theme", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ColorThemeProvider>{children}</ColorThemeProvider>
    );

    const { result } = renderHook(() => useColorTheme(), { wrapper });

    expect(result.current.colorTheme).toBe("blue");
  });

  it("applies custom default theme", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ColorThemeProvider defaultTheme="violet">{children}</ColorThemeProvider>
    );

    const { result } = renderHook(() => useColorTheme(), { wrapper });

    expect(result.current.colorTheme).toBe("violet");
  });

  it("loads theme from localStorage on mount", () => {
    mockLocalStorage.getItem.mockReturnValue("orange");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ColorThemeProvider>{children}</ColorThemeProvider>
    );

    const { result } = renderHook(() => useColorTheme(), { wrapper });

    expect(result.current.colorTheme).toBe("orange");
  });

  it("ignores invalid localStorage values", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid-theme");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ColorThemeProvider>{children}</ColorThemeProvider>
    );

    const { result } = renderHook(() => useColorTheme(), { wrapper });

    expect(result.current.colorTheme).toBe("blue"); // Falls back to default
  });

  it("changes theme and updates localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ColorThemeProvider>{children}</ColorThemeProvider>
    );

    const { result } = renderHook(() => useColorTheme(), { wrapper });

    act(() => {
      result.current.setColorTheme("rose");
    });

    expect(result.current.colorTheme).toBe("rose");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "color-theme",
      "rose"
    );
  });

  it("applies CSS classes to document element", () => {
    render(
      <ColorThemeProvider>
        <TestComponent />
      </ColorThemeProvider>
    );

    // Should apply default blue theme class
    expect(document.documentElement.classList.contains("theme-blue")).toBe(
      true
    );
  });

  it("removes old theme class when changing themes", () => {
    render(
      <ColorThemeProvider>
        <TestComponent />
      </ColorThemeProvider>
    );

    // Initially has blue theme
    expect(document.documentElement.classList.contains("theme-blue")).toBe(
      true
    );

    // Change to red theme
    const redButton = screen.getByText("Set Red Theme");
    act(() => {
      redButton.click();
    });

    expect(document.documentElement.classList.contains("theme-blue")).toBe(
      false
    );
    expect(document.documentElement.classList.contains("theme-red")).toBe(true);
  });

  it("throws error when used outside provider", () => {
    // Suppress error console output for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useColorTheme());
    }).toThrow("useColorTheme must be used within a ColorThemeProvider");

    console.error = originalError;
  });
});
