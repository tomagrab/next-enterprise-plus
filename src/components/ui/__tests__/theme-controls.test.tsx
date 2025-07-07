import { render, screen } from "@/__tests__/test-utils";
import { ThemeControls } from "@/components/ui/theme-controls";
import { ColorThemeProvider } from "@/components/providers/theme/color-theme-provider";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import userEvent from "@testing-library/user-event";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <ColorThemeProvider>{children}</ColorThemeProvider>
  </ThemeProvider>
);

describe("ThemeControls", () => {
  it("renders both color theme and light/dark toggles", () => {
    render(
      <TestWrapper>
        <ThemeControls />
      </TestWrapper>
    );

    // Check for color theme toggle (palette icon)
    expect(
      screen.getByRole("button", { name: /toggle color theme/i })
    ).toBeInTheDocument();

    // Check for theme toggle (sun/moon icons) - exact name match
    expect(
      screen.getByRole("button", { name: "Toggle theme" })
    ).toBeInTheDocument();
  });

  it("allows independent control of color and light/dark themes", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ThemeControls />
      </TestWrapper>
    );

    // Test color theme toggle
    const colorButton = screen.getByRole("button", {
      name: /toggle color theme/i,
    });
    await user.click(colorButton);
    expect(screen.getByText("Color Theme")).toBeInTheDocument();

    // Close the color dropdown by clicking elsewhere
    await user.keyboard("{Escape}");

    // Test light/dark theme toggle - it uses "Toggle theme" as accessible name
    const themeButton = screen.getByRole("button", { name: "Toggle theme" });
    await user.click(themeButton);
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("maintains proper spacing between controls", () => {
    const { container } = render(
      <TestWrapper>
        <ThemeControls />
      </TestWrapper>
    );

    const controlsContainer = container.querySelector(
      ".flex.items-center.gap-2"
    );
    expect(controlsContainer).toBeInTheDocument();
  });
});
